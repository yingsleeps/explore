const express = require("express");
const multer = require("multer");
const { generatePrompt, generateLandmarks, addUserToLandmark } = require("../controllers/landmarkController");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const router = express.Router();
const upload = multer({ dest: 'uploads/' })

const test = async(req, res) => {
    try{
        const file = req.file
        console.log(file)

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