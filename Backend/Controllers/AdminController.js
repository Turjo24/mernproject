const mongoose = require('mongoose');
const UserModel = require("../Models/user");
const CartModel = require("../Models/cartModel");
const ProductModel = require('../Models/Product');

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}, '-password -refreshToken');
    res.status(200).json({ users, success: true });
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Internal server error", error: error.message, success: false });
  }
};

const getAllCartItems = async (req, res) => {
  try {
    console.log("Fetching cart items...");
    const cartItems = await CartModel.find().lean();
    
    console.log("Cart items fetched:", cartItems);
    
    if (!cartItems || cartItems.length === 0) {
      return res.status(404).json({ message: "No cart items found", success: false });
    }
    
    // Get unique user and product IDs
    const userIds = [...new Set(cartItems.map(item => item.userId))];
    const productIds = [...new Set(cartItems.map(item => item.productId))];
    
    // Fetch users and products in bulk
    const users = await UserModel.find({ _id: { $in: userIds } }, 'name email').lean();
    const products = await ProductModel.find({ _id: { $in: productIds } }, 'title price').lean();
    
    // Create lookup objects
    const userLookup = users.reduce((acc, user) => {
      acc[user._id.toString()] = user;
      return acc;
    }, {});
    const productLookup = products.reduce((acc, product) => {
      acc[product._id.toString()] = product;
      return acc;
    }, {});
    
    const formattedCartItems = cartItems.map(item => ({
      _id: item._id,
      user: userLookup[item.userId.toString()] || { name: 'Unknown', email: 'Unknown' },
      product: productLookup[item.productId.toString()] || { title: 'Unknown Product', price: 0 },
      quantity: item.quantity
    }));
    
    res.status(200).json({ cartItems: formattedCartItems, success: true });
  } catch (error) {
    console.error("Error fetching all cart items:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      stack: error.stack,
      success: false
    });
  }
};

const getAdminProfile = async (req, res) => {
  try {
    const admin = await UserModel.findById(req.user.id).select('name email');
    if (!admin) {
      return res.status(404).json({ message: "Admin not found", success: false });
    }
    res.json({ admin, success: true });
  } catch (error) {
    console.error("Error in getAdminProfile:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await UserModel.countDocuments();
    const totalCartItems = await CartModel.countDocuments();
    const totalProducts = await ProductModel.countDocuments();

    // Get top 5 products in cart
    const topProducts = await CartModel.aggregate([
      { $group: { _id: "$productId", count: { $sum: "$quantity" } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: "$productInfo" },
      {
        $project: {
          _id: 1,
          count: 1,
          title: "$productInfo.title"
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalCartItems,
        totalProducts,
        topProducts
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};


module.exports = {
  getAllUsers,
  getAllCartItems,
  getAdminProfile,
  getDashboardStats
};