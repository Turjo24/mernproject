const express = require('express');
const router = express.Router();
const AdminController = require('../Controllers/AdminController');
const { verifyToken, isAdmin } = require('../Middlewares/authMiddleware');

router.get('/users', verifyToken, isAdmin, AdminController.getAllUsers);
router.get('/cartitems', verifyToken, isAdmin, AdminController.getAllCartItems);
router.get('/profile', verifyToken, isAdmin, AdminController.getAdminProfile);

module.exports = router;
