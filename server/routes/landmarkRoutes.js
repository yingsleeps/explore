const express = require("express");
const multer = require("multer");
const { generatePrompt, generateLandmarks, addUserToLandmark } = require("../controllers/landmarkController");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const router = express.Router();
const upload = multer({ dest: 'uploads/' })

const test = async(req, res) => {
    try{
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const natureChat = model.startChat({
            history: [
            ],
            generationConfig: {
              maxOutputTokens: 100,
            },
          });
        const natureOrCityPrompt = 
        `I am going to give you latitude and longitude coordinates. Can you please tell me whether these coordinates are in a city or in nature? If it is in a city please respond with "city" and if it is in nature please respond with "nature", thank you. 34.107112640749605, -118.53088908801442`;
        const natureOrCity = await (await natureChat.sendMessage(natureOrCityPrompt)).response.text(); // If its nature it will reply with "nature";

        console.log(natureOrCity);

        return res.status(200).json("Success");
    } catch(err){
        console.log(err);
        return res.status(500).json("Internal Error")
    }
}

router.get("/generate/landmarks/:latitude/:longitude", generateLandmarks)

router.post('/generate/prompt', generatePrompt)
router.post('/add/user', upload.single("image"), addUserToLandmark)
router.post('/test', upload.single("file"), test)


module.exports = router;