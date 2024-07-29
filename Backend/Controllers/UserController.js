const UserModel = require('../Models/user');

exports.getUserRole = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    res.json({ role: user.role, success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};