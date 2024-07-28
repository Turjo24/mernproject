const Order = require('../Models/orderModel');
const CartItem = require('../Models/cartModel');
const Product = require('../Models/Product');
const User = require('../Models/user');

const createOrder = async (req, res) => {
  try {
    const { userId, paymentMethod, address } = req.body;

    // Fetch cart items
    const cartItems = await CartItem.find({ userId }).populate('productId');

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty", success: false });
    }

    // Calculate total amount and prepare order products
    let totalAmount = 0;
    const orderProducts = cartItems.map(item => {
      totalAmount += item.productId.price * item.quantity;
      return {
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price
      };
    });

    // Create new order
    const newOrder = new Order({
      userId,
      products: orderProducts,
      totalAmount,
      paymentMethod,
      address, // Add address to the order
      status: 'Pending'
    });

    await newOrder.save();

    // Clear the user's cart
    await CartItem.deleteMany({ userId });

    res.status(201).json({ message: "Order created successfully", orderId: newOrder._id, success: true });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error", error: error.message, success: false });
  }
};
const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ userId })
      .populate('products.productId')
      .sort({ createdAt: -1 });
    res.status(200).json({ orders, success: true });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Internal server error", error: error.message, success: false });
  }
};

const getAllOrders = async (req, res) => {
  try {
    console.log('Attempting to fetch all orders');
    const orders = await Order.find()
      .populate({
        path: 'userId',
        select: 'name email',
        model: User
      })
      .populate({
        path: 'products.productId',
        model: Product
      })
      .sort({ createdAt: -1 });

    console.log('Orders fetched successfully:', orders.length);
    res.status(200).json({ orders, success: true });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.toString(),
      success: false
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const result = await Order.findByIdAndDelete(orderId);
    if (!result) {
      return res.status(404).json({ message: "Order not found", success: false });
    }
    res.status(200).json({ message: "Order deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Internal server error", error: error.message, success: false });
  }
};

// New function to update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Payment Done'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status", success: false });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found", success: false });
    }

    res.status(200).json({ message: "Order status updated successfully", order: updatedOrder, success: true });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error", error: error.message, success: false });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  deleteOrder,
  updateOrderStatus
};