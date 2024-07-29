const express = require('express');
const router = express.Router();
const { verifyToken } = require('../Middlewares/authMiddleware');
const UserController = require('../Controllers/UserController');

router.get('/role', verifyToken, UserController.getUserRole);

module.exports = router;