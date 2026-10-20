const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken); // All cart routes require authentication

router.get('/', cartController.getCart);
router.post('/sync', cartController.syncCart);
router.post('/add', cartController.addToCart);
router.put('/update', cartController.updateQuantity);
router.delete('/item/:foodId', cartController.removeItem);
router.delete('/clear', cartController.clearCart);

module.exports = router;
