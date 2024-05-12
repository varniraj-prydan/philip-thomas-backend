const Product = require("../models/product");
const { correctResponse, statusCode, messageResponse } = require("../utils/response");


const Category = require('../models/categoryModel'); // Import the Category model

exports.addProduct = async (req, res) => {
    try {
        const productImg = req.file;
        const { productName, qty_available, productPrice, description, category_id } = req.body;

        const newProduct = {
            productName,
            productImg: productImg.path,
            qty_available,
            productPrice,
            description,
            category_id
        };

        const product = await Product.create(newProduct);

        // Update category product count if category_id is provided
        if (category_id) {
            await Category.findByIdAndUpdate(category_id, { $inc: { productCount: 1 } });
        }

        return correctResponse({
            res,
            statusCode: statusCode.OK,
            msg: messageResponse.ADDED,
            data: product
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.editProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const productImg = req.file;
        const { productName, qty_available, productPrice, description, category_id } = req.body;

        // Find the existing product
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return correctResponse({
                res,
                statusCode:statusCode.NOT_FOUND,
                msg:messageResponse.NOT_FOUND,
            })
        }

        // Store the existing category_id for comparison
        const previousCategoryId = existingProduct.category_id;

        const updatedProductData = {
            ...(productName && { productName }),
            ...(productImg && { productImg: productImg.path }),
            ...(qty_available !== undefined && { qty_available }),
            ...(productPrice !== undefined && { productPrice }),
            ...(description && { description }),
            ...(category_id && { category_id }),
        };

        // Update the product
        const product = await Product.findByIdAndUpdate(productId, updatedProductData, { new: true });

        // If category_id is updated, update product count in categories
        if (category_id && category_id.toString() !== previousCategoryId.toString()) {
            // Decrement product count of previous category
            await Category.findByIdAndUpdate(previousCategoryId, { $inc: { productCount: -1 } });
            // Increment product count of new category
            await Category.findByIdAndUpdate(category_id, { $inc: { productCount: 1 } });
        }

        return correctResponse({
            res,
            statusCode: statusCode.OK,
            msg: messageResponse.UPDATED,
            data: product
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.getProducts = async (req, res) => {
    try {
        // Check if category_id is provided in the query parameters
        const categoryId = req.query.categoryId;

        let products;

        // If categoryId is provided, fetch products by category
        if (categoryId) {
            // Retrieve all products with the given category_id
            products = await Product.find({ category_id: categoryId });
        } else {
            // If categoryId is not provided, retrieve all products
            products = await Product.find();
        }

        // If there are no products found, return a 404 Not Found response
        if (!products || products.length === 0) {
            return correctResponse({
                res,
                statusCode: statusCode.NOT_FOUND,
                msg: messageResponse.NOT_FOUND,
            });
        }

        // Concatenate the server path with the productImg path in each product
        const server_path = process.env.SERVER_PATH; // Assuming this is the server path
        const productsWithFullImagePath = products.map(product => {
            return {
                ...product._doc,
                productImg: server_path + product.productImg // Concatenate the server path with productImg path
            };
        });

        // Return the list of products with full image paths
        return correctResponse({
            res,
            statusCode: statusCode.OK,
            msg: messageResponse.DATA_FETCHED,
            data: productsWithFullImagePath,
        });
    } catch (error) {
        // If an error occurs during the operation, return a 500 Internal Server Error response
        return correctResponse({
            res,
            statusCode: statusCode.INTERNAL_SERVER_ERROR,
            msg: error.message
        });
    }
};


exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.productId;

        // Retrieve the product from the database by its ID
        const product = await Product.findById(productId).populate("category_id");

        // If the product is not found, return a 404 Not Found response
        if (!product) {
            // return res.status(404).json({ message: "Product not found" });
            return correctResponse({
                res,
                statusCode:statusCode.NOT_FOUND,
                msg:messageResponse.NOT_FOUND,
            })
        }

        // Concatenate the server path with the productImg path
        const server_path = process.env.SERVER_PATH; // Assuming this is the server path
        const productWithFullImagePath = {
            ...product._doc,
            productImg: server_path + product.productImg // Concatenate the server path with productImg path
        };

        // Return the product with full image path
        return correctResponse({
            res,
            statusCode: statusCode.OK,
            msg: messageResponse.DATA_FETCHED,
            data: productWithFullImagePath,
        });
    } catch (error) {
        // If an error occurs during the operation, return a 500 Internal Server Error response
        return correctResponse({
            res,
            statusCode: statusCode.INTERNAL_SERVER_ERROR,
            msg: error.message
        });
    }
};


exports.deleteProductById = async (req, res) => {
    try {
        const productId = req.params.productId;

        // Find the product by its ID and delete it
        const deletedProduct = await Product.findByIdAndDelete(productId);

        // If the product is not found, return a 404 Not Found response
        if (!deletedProduct) {
            return correctResponse({
                res,
                statusCode: statusCode.NOT_FOUND,
                msg: messageResponse.NOT_FOUND,
            });
        }

        // If the product had a category_id, decrement the product count in the associated category
        if (deletedProduct.category_id) {
            await Category.findByIdAndUpdate(deletedProduct.category_id, { $inc: { productCount: -1 } });
        }

        // Return a success message indicating that the product has been deleted
        return correctResponse({
            res,
            statusCode: statusCode.OK,
            msg: messageResponse.DELETED,
            data: deletedProduct,
        });
    } catch (error) {
        // If an error occurs during the operation, return a 500 Internal Server Error response
        return correctResponse({
            res,
            statusCode: statusCode.INTERNAL_SERVER_ERROR,
            msg: error.message
        });
    }
};