const Food = require('../models/Food');

// @desc    Fetch food items with filters, search, and sorting
// @route   GET /api/food
// @access  Public
exports.getFoods = async (req, res) => {
  try {
    const { category, search, isVeg, sort, available } = req.query;
    const filter = {};

    // Filter by availability (by default return available only for customers, unless explicitly requesting all)
    if (available !== undefined) {
      filter.available = available === 'true';
    }

    // Filter by category
    if (category && category !== 'All' && category !== 'all') {
      filter.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
    }

    // Filter by Vegetarian status
    if (isVeg !== undefined && isVeg !== 'all' && isVeg !== '') {
      filter.isVeg = isVeg === 'true';
    }

    // Search query on name and description
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { price: -1 };
    } else if (sort === 'rating_desc') {
      sortOption = { rating: -1 };
    } else if (sort === 'name_asc') {
      sortOption = { name: 1 };
    }

    const foods = await Food.find(filter).sort(sortOption);

    return res.status(200).json({
      success: true,
      count: foods.length,
      foods
    });
  } catch (error) {
    console.error('getFoods error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch food items',
      error: error.message
    });
  }
};

// @desc    Fetch single food item by ID
// @route   GET /api/food/:id
// @access  Public
exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    return res.status(200).json({
      success: true,
      food
    });
  } catch (error) {
    console.error('getFoodById error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch food item',
      error: error.message
    });
  }
};

// @desc    Add new food item with Multer image upload
// @route   POST /api/food
// @access  Private/Admin
exports.createFood = async (req, res) => {
  try {
    let { name, description, price, category, rating, isVeg, available, prepTime, image } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, price, and category are required'
      });
    }

    // Check if uploaded file exists
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'Food image is required (upload file or provide image URL)'
      });
    }

    const food = await Food.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category: category.trim(),
      image,
      rating: rating ? Number(rating) : 4.5,
      isVeg: isVeg === 'true' || isVeg === true,
      available: available !== undefined ? (available === 'true' || available === true) : true,
      prepTime: prepTime ? prepTime.trim() : '25-35 mins'
    });

    return res.status(201).json({
      success: true,
      message: 'Food item created successfully',
      food
    });
  } catch (error) {
    console.error('createFood error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create food item',
      error: error.message
    });
  }
};

// @desc    Update food item / toggle availability
// @route   PUT /api/food/:id
// @access  Private/Admin
exports.updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, description, price, category, rating, isVeg, available, prepTime, image } = req.body;

    const food = await Food.findById(id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    if (name) food.name = name.trim();
    if (description) food.description = description.trim();
    if (price !== undefined) food.price = Number(price);
    if (category) food.category = category.trim();
    if (image) food.image = image;
    if (rating !== undefined) food.rating = Number(rating);
    if (isVeg !== undefined) food.isVeg = isVeg === 'true' || isVeg === true;
    if (available !== undefined) food.available = available === 'true' || available === true;
    if (prepTime) food.prepTime = prepTime.trim();

    await food.save();

    return res.status(200).json({
      success: true,
      message: 'Food item updated successfully',
      food
    });
  } catch (error) {
    console.error('updateFood error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update food item',
      error: error.message
    });
  }
};

// @desc    Delete food item
// @route   DELETE /api/food/:id
// @access  Private/Admin
exports.deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findByIdAndDelete(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Food item deleted successfully'
    });
  } catch (error) {
    console.error('deleteFood error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete food item',
      error: error.message
    });
  }
};
