const express = require("express");
const multer = require("multer");
const { generatePrompt } = require("../controllers/landmarkController");

const router = express.Router();

router.post('/generate/prompt', generatePrompt)

module.exports = router;