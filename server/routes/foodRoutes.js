const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', foodController.getFoods);
router.get('/:id', foodController.getFoodById);
router.post('/', verifyToken, verifyAdmin, upload.single('image'), foodController.createFood);
router.put('/:id', verifyToken, verifyAdmin, upload.single('image'), foodController.updateFood);
router.delete('/:id', verifyToken, verifyAdmin, foodController.deleteFood);

module.exports = router;
