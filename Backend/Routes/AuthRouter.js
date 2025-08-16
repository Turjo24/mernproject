const { signup, login } = require('../Controllers/AuthController');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');
const { logout } = require('../Controllers/AuthController');
const {biometricLogin, addBiometric, removeBiometric, checkBiometricStatus} = require('../Controllers/AuthController');


const router = require('express').Router();
const express = require('express');
const AuthController = require('../Controllers/AuthController');

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
router.post('/logout', logout);
router.post('/refresh-token', AuthController.refreshToken)


router.post('/biometric-login', biometricLogin);
router.post('/add-biometric', addBiometric);
router.post('/remove-biometric', removeBiometric);
router.get('/biometric-status/:email', checkBiometricStatus);

module.exports = router;
