// categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../../controller/categoryController');

// Create a new category
router.post('/categories', categoryController.createCategory);

// Get all categories
router.get('/categories', categoryController.getAllCategories);

// Get category by ID
router.get('/categories/:categoryId', categoryController.getCategoryById);

// Update category by ID
router.patch('/categories/:categoryId', categoryController.updateCategory);

// Delete category by ID
router.delete('/categories/:categoryId', categoryController.deleteCategory);

module.exports = router;