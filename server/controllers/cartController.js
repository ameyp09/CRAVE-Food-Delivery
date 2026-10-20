const Cart = require('../models/Cart');
const Food = require('../models/Food');

// Helper to populate and calculate cart summary
const populateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.food');
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  // Filter out any items where food was deleted
  const validItems = cart.items.filter(item => item.food !== null);
  if (validItems.length !== cart.items.length) {
    cart.items = validItems;
    await cart.save();
  }

  return cart;
};

// @desc    Fetch logged-in user cart items
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    const cart = await populateCart(req.user._id);

    return res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('getCart error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: error.message
    });
  }
};

// @desc    Add item to cart or increment
// @route   POST /api/cart/add
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { foodId, quantity = 1 } = req.body;

    if (!foodId) {
      return res.status(400).json({
        success: false,
        message: 'Food ID is required'
      });
    }

    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    if (!food.available) {
      return res.status(400).json({
        success: false,
        message: 'This food item is currently out of stock'
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.food.toString() === foodId.toString()
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        food: foodId,
        quantity: Number(quantity)
      });
    }

    cart.updatedAt = new Date();
    await cart.save();

    const updatedCart = await populateCart(req.user._id);

    return res.status(200).json({
      success: true,
      message: 'Item added to cart',
      cart: updatedCart
    });
  } catch (error) {
    console.error('addToCart error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error.message
    });
  }
};

// @desc    Update item quantity
// @route   PUT /api/cart/update
// @access  Private
exports.updateQuantity = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;

    if (!foodId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Food ID and quantity are required'
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const newQty = Number(quantity);
    const itemIndex = cart.items.findIndex(
      (item) => item.food.toString() === foodId.toString()
    );

    if (itemIndex > -1) {
      if (newQty <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = newQty;
      }
    } else if (newQty > 0) {
      cart.items.push({ food: foodId, quantity: newQty });
    }

    cart.updatedAt = new Date();
    await cart.save();

    const updatedCart = await populateCart(req.user._id);

    return res.status(200).json({
      success: true,
      message: 'Cart updated',
      cart: updatedCart
    });
  } catch (error) {
    console.error('updateQuantity error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update cart item quantity',
      error: error.message
    });
  }
};

// @desc    Remove specific item from cart
// @route   DELETE /api/cart/item/:foodId
// @access  Private
exports.removeItem = async (req, res) => {
  try {
    const { foodId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(
      (item) => item.food.toString() !== foodId.toString()
    );

    cart.updatedAt = new Date();
    await cart.save();

    const updatedCart = await populateCart(req.user._id);

    return res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart: updatedCart
    });
  } catch (error) {
    console.error('removeItem error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: error.message
    });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.updatedAt = new Date();
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cart: { items: [], user: req.user._id }
    });
  } catch (error) {
    console.error('clearCart error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
};

// @desc    Sync local guest cart upon login
// @route   POST /api/cart/sync
// @access  Private
exports.syncCart = async (req, res) => {
  try {
    const { items = [] } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Merge incoming guest items into existing cart
    for (const incomingItem of items) {
      const foodId = incomingItem.food?._id || incomingItem.food || incomingItem._id;
      const qty = Number(incomingItem.quantity) || 1;

      if (!foodId) continue;

      const existingIndex = cart.items.findIndex(
        (i) => i.food.toString() === foodId.toString()
      );

      if (existingIndex > -1) {
        cart.items[existingIndex].quantity += qty;
      } else {
        cart.items.push({ food: foodId, quantity: qty });
      }
    }

    cart.updatedAt = new Date();
    await cart.save();

    const updatedCart = await populateCart(req.user._id);

    return res.status(200).json({
      success: true,
      message: 'Cart synchronized successfully',
      cart: updatedCart
    });
  } catch (error) {
    console.error('syncCart error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to sync cart',
      error: error.message
    });
  }
};
