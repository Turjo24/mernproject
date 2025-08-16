const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/user");
const crypto = require('crypto');

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

// Helper function to hash biometric data
const hashBiometricData = (biometricData) => {
  return crypto.createHash('sha256').update(biometricData).digest('hex');
};

// Signup function with optional biometric
const signup = async (req, res) => {
  try {
    const { name, email, password, biometricData } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(409).json({ message: 'User already exists, you can login', success: false });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = email === ADMIN_EMAIL ? 'admin' : 'user';
    
    // Create user object
    const userData = { 
      name, 
      email, 
      password: hashedPassword, 
      role,
      biometricEnabled: false 
    };
    
    // If biometric data is provided, hash and store it
    if (biometricData) {
      userData.biometricHash = hashBiometricData(biometricData);
      userData.biometricEnabled = true;
    }
    
    const userModel = new UserModel(userData);

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
      userId: userModel._id.toString(),
      biometricEnabled: userModel.biometricEnabled
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

// Regular login function
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
          password: await bcrypt.hash(ADMIN_PASSWORD, 10),
          biometricEnabled: false
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
      userId: user._id.toString(),
      biometricEnabled: user.biometricEnabled || false
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

// Biometric login function
const biometricLogin = async (req, res) => {
  try {
    const { email, biometricData } = req.body;
    
    if (!email || !biometricData) {
      return res.status(400).json({ 
        message: 'Email and biometric data are required', 
        success: false 
      });
    }
    
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(403).json({ 
        message: 'User not found', 
        success: false 
      });
    }
    
    if (!user.biometricEnabled || !user.biometricHash) {
      return res.status(403).json({ 
        message: 'Biometric authentication not enabled for this user', 
        success: false 
      });
    }
    
    // Compare biometric data
    const providedHash = hashBiometricData(biometricData);
    if (providedHash !== user.biometricHash) {
      return res.status(403).json({ 
        message: 'Biometric authentication failed', 
        success: false 
      });
    }

    const { accessToken, refreshToken, jwtToken } = generateTokens(user);
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      message: "Biometric Login Success",
      success: true,
      accessToken,
      refreshToken,
      jwtToken,
      email: user.email,
      name: user.name,
      role: user.role,
      userId: user._id.toString(),
      biometricEnabled: true
    });
  } catch (err) {
    console.error("Biometric login error:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

// Add biometric to existing user
const addBiometric = async (req, res) => {
  try {
    const { userId, biometricData } = req.body;
    
    if (!userId || !biometricData) {
      return res.status(400).json({ 
        message: 'User ID and biometric data are required', 
        success: false 
      });
    }
    
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found', 
        success: false 
      });
    }
    
    user.biometricHash = hashBiometricData(biometricData);
    user.biometricEnabled = true;
    await user.save();
    
    res.status(200).json({
      message: "Biometric added successfully",
      success: true,
      biometricEnabled: true
    });
  } catch (err) {
    console.error("Add biometric error:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

// Remove biometric from user
const removeBiometric = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        message: 'User ID is required', 
        success: false 
      });
    }
    
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found', 
        success: false 
      });
    }
    
    user.biometricHash = undefined;
    user.biometricEnabled = false;
    await user.save();
    
    res.status(200).json({
      message: "Biometric removed successfully",
      success: true,
      biometricEnabled: false
    });
  } catch (err) {
    console.error("Remove biometric error:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

// Check if user has biometric enabled
const checkBiometricStatus = async (req, res) => {
  try {
    const { email } = req.params;
    
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found', 
        success: false 
      });
    }
    
    res.status(200).json({
      success: true,
      biometricEnabled: user.biometricEnabled || false,
      email: user.email,
      name: user.name
    });
  } catch (err) {
    console.error("Check biometric status error:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

// Refresh token function (unchanged)
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
      userId: user._id
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(403).json({ message: "Invalid refresh token", success: false });
  }
};

// Logout function (unchanged)
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
  biometricLogin,
  addBiometric,
  removeBiometric,
  checkBiometricStatus,
  refreshToken,
  logout
};