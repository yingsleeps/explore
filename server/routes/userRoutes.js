const express = require("express");
const multer = require("multer")
const { createUser, loginUser, setUpUser, updateUser } = require("../controllers/userController");

const router = express.Router();

router.post('/create', createUser);
router.post('/login', loginUser);

router.patch("/setup", setUpUser);
router.patch("/update", updateUser)

module.exports = router;