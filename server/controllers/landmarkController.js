const { database, storage } = require("../firebase");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { doc, setDoc, updateDoc, arrayUnion, getDoc } = require("firebase/firestore");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { encodeFileToBase64, fileToGenerativePart } = require('../utilities/utilities');
const fs = require('fs');
const axios = require("axios");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Structure:
// {
//     id: String, // Maybe its geolocation? Something that will make it a unique identifier yet universal,
//     name: String, // Name of the Landmark
//     visitors: [
//         {
//             userId: String, // The ID of the user that visited
//             prompt: {
//                 // Prompt that they answered
//                 challenge: String // This will be the prompt/challenge they're given
//                 result: String // this will be a link to the storage bucket that holds their photo/drawing
//             }
//         }
//     ]
// }



const generatePrompt = async(req, res) => {
    try {
        // Send the landmark in as a longitude, latitude parameter
        const { landmark, art } = req.body; 
        // Assuming the following structure landmark = { longitude, latitude, name }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        // This would be used if we want offline capabilties
        // Prompt Gemini to find out whether or not it is a city
        const natureChat = model.startChat({
            history: [
            ],
            generationConfig: {
              maxOutputTokens: 100,
            },
          });
        const natureOrCityPrompt = 
        `I am going to give you longitude and latitude coordinates. Can you please tell me whether these coordinates are in a city or in nature? If it is in a city please respond with "city" and if it is in nature please respond with "nature", thank you. ${landmark.latitude}, ${landmark.longitude}`;
        const natureOrCity = await (await natureChat.sendMessage(natureOrCityPrompt)).response.text(); // If its nature it will reply with "nature";
        
        var challenge;
        const promptChat = model.startChat()

        if(natureOrCity === "nature"){
            if (art){
                return res.status(200).json("Draw a picture of your surrounding landscape.");
            } else {
                return res.status(200).json("Take a picture of your surrounding landscape.");
            }
        }

        // Prompt to generate a challenge
        if (art /* If its a drawing this will be true */){
            // Beta Prompt for Art
            const artChallengePrompt = 
            `I am at the ${landmark.name} landmark at the coordinates ${landmark.latitude}, ${landmark.longitude}. I want to create a drawing challenge at this location. The challenge should implore its users to draw a picture related to this landmark. Please provide an extremely simple drawing challenge that users can do on their mobile devices. Pleas output the challenge in a single sentence.`;
            challenge = await promptChat.sendMessage(artChallengePrompt);
        } else {
            // Beta Prompt for Photo
            const photoChallengePrompt = 
            `I am at the ${landmark.name} landmark at the coordinates ${landmark.latitude}, ${landmark.longitude}. I want to create a photo challenge at this location. The challenge should implore its users to take a picture related to this landmark. The challenge should incorporate history specific to the landmark. Please provide a simple challenge that fits the criteria in a single sentence.`;
            challenge = await promptChat.sendMessage(photoChallengePrompt);
        }

        const challengePrompt = (await challenge.response).text();
        
        return res.status(200).json(challengePrompt);
    } catch(err){
        console.log(err)
        return res.status(500).json("Internal Error");
    }
}

const addUserToLandmark = async(req, res) => {
    try {
        // Setting the Model
        const ratingModel = genAI.getGenerativeModel({model: "gemini-pro-vision"})

        // Gets the landmark, uid, prompt
        // landmark = { longitude, latitude, name }
        const { name, latitude, longitude, userId, quest } = req.body;
        const image = req.file;

        // First Upload the Image so if there is an error you can send an error back
        const imageRef = ref(storage, `landmarks/${name}/${image.originalname}`);
        try{
            await uploadBytes(imageRef, fs.readFileSync(image.path), { contentType: 'image/jpeg' });
        } catch(err){
            console.log(err);
            return res.status(500).json("Internal Error");
        }

        const base64image = await encodeFileToBase64(image.path)

        // Rating the Image in response to the prompt
        let result;
        const geminiPrompt = `I have the following prompt as a challenge: "${quest}" I will be uploading a photo for you to examine. Please rate this photo's ability to answer the prompt on a scale of 1-10. Please also output only the number for the rating.`;
        const imageParts = [
            fileToGenerativePart(base64image, image.mimetype)
        ]
        try {
            result = await ratingModel.generateContent([geminiPrompt, ...imageParts]);
        } catch(err){
            console.log(err);
            return res.status(400).json("Gemini Failed")
        }

        const rating = (await result.response).text()

        // Retrieve the Image Url
        const imageUri = await getDownloadURL(imageRef)
        // Updating the Landmark
        try {
            const landmarkID = encodeURIComponent(`${latitude},${longitude}`); // gets the id for the database
            const landmarkDoc = doc(database, "landmark", landmarkID);
            await updateDoc(landmarkDoc, {
                visitors: arrayUnion({
                    uid: userId,
                    prompt:{
                        quest: quest,
                        result: imageUri,
                    },
                    rating: rating
                })
            });
        } catch(err) {
            console.log(err);
            return res.status(400).json("Failed to update Landmark");
        }

        // Updating the User
        try{
            const userDoc = doc(database, "users", userId);
            await updateDoc(userDoc, {
                visited: arrayUnion({
                    name: name,
                    quest: quest,
                    result: imageUri,
                    rating: rating,
                })
            })
        } catch(err){
            console.log(err);
            return res.status(400).json("Failed ot update User");
        }

        return res.status(200).json(rating);
    } catch(err){
        console.log(err)
        return res.status(500).json("Internal Error");
    }
}

const generateLandmarks = async(req, res) => {
    try{
        // location = { latitude, longitude }
        const { latitude, longitude } = req.params

        const locationUriComponent = encodeURIComponent(`${latitude},${longitude}`)
        const radius = 16093.4; // this is measured in meters

        let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${locationUriComponent}&radius=${radius}000&key=${process.env.GOOGLE_MAPS_API_KEY}&types=landmark`

        let response = null;

        try{
            response = await axios.get(url);
        } catch (err){
            console.log(err);
            res.status(501).json("Failed to Request Landmarks");
        }
        
        if (response === null){
            res.status(501).json("Failed to Request Landmarks");
        }

        if (response.data.results.length < 10){
            url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${locationUriComponent}&radius=${radius}000&key=${process.env.GOOGLE_MAPS_API_KEY}&types=park`
            response = await axios.get(url);
        }
        
        if (response === null){
            res.status(501).json("Failed to Request Landmarks");
        }

        const firstTenLocations = response.data.results.slice(0, 10);
    
        const questLocations = [];

        await Promise.all(firstTenLocations.map(async(landmark) => {
            const locationData ={
                latitude: landmark.geometry.location.lat,
                longitude: landmark.geometry.location.lng,
                name: landmark.name
            };
            questLocations.push(locationData);
            await setDoc(doc(database, "landmark", 
                encodeURIComponent(`${locationData.latitude},${locationData.longitude}`)), locationData)
                .catch((err)=>{
                    console.log(err);
                    return res.status(500).json("Internal Error");
                });
        }));
        

        return res.status(200).json(questLocations);
    } catch(err){
        console.log(err);
        return res.status(500).json("Internal Error");
    }
}


module.exports = { 
    addUserToLandmark,
    generatePrompt,
    generateLandmarks
}