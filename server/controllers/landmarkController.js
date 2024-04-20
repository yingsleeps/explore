const { database } = require("../firebase");
const { GoogleGenerativeAI } = require("@google/generative-ai");

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
//                 art: Boolean, // it will be true if they drew and false if they took a picture
//                 result: String // this will be a link to the storage bucket that holds their photo/drawing
//             }
//         }
//     ]
// }

const generatePrompt = async(req, res) => {
    try {
        // Send the landmark in as a longitude, latitude parameter
        const { landmark, art } = req.body; 
        // Assuming the following structure landmark = { longitude, latitude }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        // This would be used if we want offline capabilties
        // Prompt Gemini to find out whether or not it is a city
        // const natureChat = model.startChat({
        //     history: [
        //     ],
        //     generationConfig: {
        //       maxOutputTokens: 100,
        //     },
        //   });
        // const natureOrCityPrompt = 
        // `I am going to give you longitude and latitude coordinates. Can you please tell me whether these coordinates are in a city or in nature? If it is in a city please respond with "city" and if it is in nature please respond with "nature", thank you. ${landmark.latitude}, ${landmark.longitude}`;
        // const natureOrCity = await natureChat.sendMessage(natureOrCityPrompt); // If its nature it will reply with "nature";
        
        var challenge;
        const promptChat = model.startChat()

        // Prompt to generate a challenge
        if (art /* If its a drawing this will be true */){
            // Beta Prompt for Art
            const artChallengePrompt = 
            `I am at the ${landmark.name} landmark at the coordinates ${landmark.latitude}, ${landmark.longitude}. I want to create a drawing challenge at this location. The challenge should implore its users to draw a picture related to this landmark. The challenge should incorporate history specific to the landmark. Please be as specific as possible and provide a challenge in a single sentence.`;
            challenge = await promptChat.sendMessage(artChallengePrompt);
        } else {
            // Beta Prompt for Photo
            const photoChallengePrompt = 
            ``;
            challenge = await promptChat.sendMessage(photoChallengePrompt);
        }

        const challengePrompt = (await challenge.response).text();
        
        console.log(challengePrompt);

        return res.status(200).json(challenge)
    } catch(err){
        console.log(err)
        return res.status(500).json("Internal Error");
    }
}

const addToLandmark = async(req, res) => {
    try {
        const { landmark, userId, prompt } = req.body

    } catch(err){
        console.log(err)
        return res.status(500).json("Internal Error");
    }
}


module.exports = { 
    addToLandmark,
    generatePrompt
}