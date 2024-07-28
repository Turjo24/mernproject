const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/user");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Function to generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { email: user.email, id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { email: user.email, id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
  const jwtToken = jwt.sign(
    { email: user.email, id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  return { accessToken, refreshToken, jwtToken };
};

// Signup function
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(409).json({ message: 'User already exists, you can login', success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = email === ADMIN_EMAIL ? 'admin' : 'user'; // Only check the email for signup
    const userModel = new UserModel({ name, email, password: hashedPassword, role });

    const { accessToken, refreshToken, jwtToken } = generateTokens(userModel);
    userModel.refreshToken = refreshToken;
    await userModel.save();

    res.status(201).json({
      message: "Signup successful",
      success: true,
      accessToken,
      refreshToken,
      jwtToken,
      name: userModel.name,
      email: userModel.email,
      role: userModel.role,
      userId: userModel._id.toString() // Include userId in the response
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

// Login function
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await UserModel.findOne({ email });
    const errorMsg = 'Auth failed: email or password is wrong';
    
    if (!user) {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Admin login
        user = new UserModel({
          email: ADMIN_EMAIL,
          role: 'admin',
          name: 'Admin User',
          password: await bcrypt.hash(ADMIN_PASSWORD, 10)
        });
      } else {
        return res.status(403).json({ message: errorMsg, success: false });
      }
    }
    
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({ message: errorMsg, success: false });
    }

    const { accessToken, refreshToken, jwtToken } = generateTokens(user);
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      message: "Login Success",
      success: true,
      accessToken,
      refreshToken,
      jwtToken,
      email,
      name: user.name,
      role: user.role,
      userId: user._id.toString() // Ensure userId is included and converted to string
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};
// Refresh token function
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required", success: false });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await UserModel.findOne({ _id: decoded.id, refreshToken });

    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token", success: false });
    }

    const { accessToken, refreshToken: newRefreshToken, jwtToken } = generateTokens(user);
    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      success: true,
      accessToken,
      refreshToken: newRefreshToken,
      jwtToken,
      userId: user._id // Include userId in the response
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(403).json({ message: "Invalid refresh token", success: false });
  }
};

// Logout function
const logout = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const user = await UserModel.findOne({ refreshToken });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    res.status(200).json({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

module.exports = {
  signup,
  login,
  refreshToken,
  logout
};
