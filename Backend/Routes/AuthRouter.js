const { signup, login } = require('../Controllers/AuthController');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');
const { logout } = require('../Controllers/AuthController');

const router = require('express').Router();
const express = require('express');
const AuthController = require('../Controllers/AuthController');

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
router.post('/logout', logout);
router.post('/refresh-token', AuthController.refreshToken)



module.exports = router;
