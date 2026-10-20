const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', categoryController.getCategories);
router.post('/', verifyToken, verifyAdmin, upload.single('image'), categoryController.createCategory);
router.put('/:id', verifyToken, verifyAdmin, upload.single('image'), categoryController.updateCategory);
router.delete('/:id', verifyToken, verifyAdmin, categoryController.deleteCategory);

module.exports = router;
