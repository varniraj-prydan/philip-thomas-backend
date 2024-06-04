// categoryController.js
const Category = require('../models/categoryModel');
const { correctResponse, statusCode, messageResponse } = require('../utils/response');

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // Check if category with the same name already exists
        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            // return res.status(400).json({ message: "Category already exists" });
            return correctResponse({
                res,
                statusCode: statusCode.BAD_REQUEST,
                msg: messageResponse.MEMBER_EXIST,
            });
        }

        const newCategory = new Category({ name });
        await newCategory.save();

        // res.status(201).json({ message: 'Category created successfully', category: newCategory });

        return correctResponse({
            res,
            statusCode: statusCode.CREATED,
            msg: messageResponse.ADDED,
            data:newCategory
        });
    } catch (error) {
        // res.status(500).json({ message: error.message });
        console.log(error)
        return correctResponse({
            res,
            statusCode: statusCode.INTERNAL_SERVER_ERROR,
            msg: messageResponse.SOMETHING_WRONG,
        });
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        // res.json(categories);
        return correctResponse({
            res,
            statusCode: statusCode.OK,
            msg: messageResponse.DATA_FETCHED,
            data:categories
        });
    } catch (error) {
        return correctResponse({
            res,
            statusCode: statusCode.INTERNAL_SERVER_ERROR,
            msg: messageResponse.SOMETHING_WRONG,
        });
    }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const category = await Category.findById(categoryId);

        if (!category) {
            return correctResponse({
                res,
                statusCode: statusCode.NOT_FOUND,
                msg: messageResponse.NOT_FOUND,
            });
        }

        // res.json(category);
        return correctResponse({
            res,
            statusCode: statusCode.OK,
            msg: messageResponse.DATA_FETCHED,
            data:category
        });
    } catch (error) {
        return correctResponse({
            res,
            statusCode: statusCode.INTERNAL_SERVER_ERROR,
            msg: messageResponse.SOMETHING_WRONG,
        });
    }
};

// Update category by ID
exports.updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const { name } = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(categoryId, { name }, { new: true });

        if (!updatedCategory) {
            return correctResponse({
                res,
                statusCode: statusCode.NOT_FOUND,
                msg: messageResponse.NOT_FOUND,
            });
        }

        // res.json({ message: "Category updated successfully", category: updatedCategory });
        return correctResponse({
            res,
            statusCode: statusCode.OK,
            msg: messageResponse.UPDATED,
            data:updatedCategory
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete category by ID
exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;

        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        if (!deletedCategory) {
            return correctResponse({
                res,
                statusCode: statusCode.NOT_FOUND,
                msg: messageResponse.NOT_FOUND,
            });
        }

        // res.json({ message: "Category deleted successfully", category: deletedCategory });
        return correctResponse({
            res,
            statusCode: statusCode.OK,
            msg: messageResponse.DELETED,
            data:deletedCategory
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};