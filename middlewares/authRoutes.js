const express = require('express');
const AuthController = require('./authController.JS');

const router = express.Router();


router.post('/login', AuthController.login);

module.exports = router;
