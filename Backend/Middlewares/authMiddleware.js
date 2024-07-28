const jwt = require('jsonwebtoken');
const UserModel = require('../Models/user');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "A token is required for authentication", success: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid Token", success: false });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin role required.", success: false });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

module.exports = { verifyToken, isAdmin };