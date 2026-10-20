const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod = 'COD' } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Order items cannot be empty'
      });
    }

    if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.phone) {
      return res.status(400).json({
        success: false,
        message: 'Delivery address with street, city, and phone number is required'
      });
    }

    // Calculate subtotal from items
    const subtotal = items.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);
    // Free delivery if subtotal > 500, else 40
    const deliveryFee = subtotal >= 500 ? 0 : 40;
    const totalAmount = subtotal + deliveryFee;

    const initialTimeline = [
      {
        status: 'Order Placed',
        timestamp: new Date()
      }
    ];

    const order = await Order.create({
      user: req.user._id,
      items: items.map(i => ({
        food: i.food?._id || i.food || i.id,
        name: i.name,
        price: Number(i.price),
        quantity: Number(i.quantity),
        image: i.image
      })),
      deliveryAddress: {
        street: deliveryAddress.street,
        city: deliveryAddress.city,
        state: deliveryAddress.state || 'State',
        zipCode: deliveryAddress.zipCode || '000000',
        phone: deliveryAddress.phone
      },
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Completed',
      subtotal,
      deliveryFee,
      totalAmount,
      orderStatus: 'Order Placed',
      statusTimeline: initialTimeline
    });

    // Clear user cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    // Optionally save address to user's address book if not already present
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        const addressExists = user.addresses.some(
          a => a.street?.toLowerCase() === deliveryAddress.street.toLowerCase() &&
               a.city?.toLowerCase() === deliveryAddress.city.toLowerCase()
        );
        if (!addressExists) {
          user.addresses.push({
            street: deliveryAddress.street,
            city: deliveryAddress.city,
            state: deliveryAddress.state || '',
            zipCode: deliveryAddress.zipCode || '',
            isDefault: user.addresses.length === 0
          });
          if (!user.phone && deliveryAddress.phone) {
            user.phone = deliveryAddress.phone;
          }
          await user.save();
        }
      }
    } catch (addrErr) {
      console.warn('Address auto-save skipped:', addrErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order
    });
  } catch (error) {
    console.error('createOrder error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to place order',
      error: error.message
    });
  }
};

// @desc    List orders for current logged-in user
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.food');

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('getMyOrders error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user orders',
      error: error.message
    });
  }
};

// @desc    Fetch detailed order tracking by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.food');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Authorization: only the owner or an admin can view
    const isOwner = order.user && order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('getOrderById error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch order details',
      error: error.message
    });
  }
};
