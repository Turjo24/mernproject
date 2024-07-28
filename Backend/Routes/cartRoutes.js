const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const CartItem = require('../Models/cartModel');
const Product = require('../Models/Product');

// Add item to cart
router.post('/add', async (req, res) => {
    try {
      const { userId, productId, quantity } = req.body;
      console.log('Received request to add item to cart:', { userId, productId, quantity });
  
      if (!userId || !productId || !quantity) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      // Validate ObjectIds
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid userId' });
      }
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid productId' });
      }
  
      // Convert userId and productId to ObjectId
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const productObjectId = new mongoose.Types.ObjectId(productId);
  
      let cartItem = await CartItem.findOne({ userId: userObjectId, productId: productObjectId });
      console.log('Existing cart item:', cartItem);
  
      if (cartItem) {
        cartItem.quantity += quantity;
        await cartItem.save();
        console.log('Updated cart item:', cartItem);
      } else {
        cartItem = new CartItem({ 
          userId: userObjectId, 
          productId: productObjectId, 
          quantity 
        });
        await cartItem.save();
        console.log('Created new cart item:', cartItem);
      }
  
      res.status(201).json({ message: 'Item added to cart successfully' });
    } catch (error) {
      console.error('Detailed error adding item to cart:', error);
      res.status(500).json({ message: 'Error adding item to cart', error: error.message });
    }
  });
  
  

// Get cart items for a user
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

    const cartItems = await CartItem.find({ userId }).populate('productId');

    const formattedCart = cartItems.map(item => ({
      productId: item.productId?._id || null,
      title: item.productId?.title || 'Product not found',
      price: item.productId?.price || 0,
      quantity: item.quantity
    }));

    res.json(formattedCart);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ message: 'Error fetching cart items', error: error.message });
  }
});
// Update cart item quantity
router.put('/update', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity == null) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid userId or productId' });
    }

    if (quantity < 1) {
      await CartItem.findOneAndDelete({ userId, productId });
      return res.json({ message: 'Item removed from cart' });
    }

    const updatedItem = await CartItem.findOneAndUpdate(
      { userId, productId },
      { quantity },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json({ message: 'Cart item updated successfully', item: updatedItem });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Error updating cart item', error: error.message });
  }
});

// Remove item from cart
router.delete('/remove', async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid userId or productId' });
    }

    const result = await CartItem.findOneAndDelete({ userId, productId });

    if (!result) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Error removing item from cart', error: error.message });
  }
});

module.exports = router;
