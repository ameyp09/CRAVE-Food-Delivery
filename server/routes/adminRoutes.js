const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// All admin routes require both a valid token and admin role
router.use(verifyToken);
router.use(verifyAdmin);

router.get('/dashboard-stats', adminController.getDashboardStats);
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);
router.get('/users', adminController.getAllUsers);

module.exports = router;
