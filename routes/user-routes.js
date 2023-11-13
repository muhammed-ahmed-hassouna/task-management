const express = require('express');
const router = express.Router()

const userController = require('../controller/user-controller');

router.post("/Signup", userController.registerUser);

router.post("/Login", userController.loginUser);


module.exports = router;