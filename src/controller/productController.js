// const Product = require("../models/product");
// const { correctResponse, statusCode, messageResponse } = require("../utils/response");


// const Category = require('../models/categoryModel'); // Import the Category model

// exports.addProduct = async (req, res) => {
//     try {
//         const productImg = req.file;
//         const { productName, qty_available, productPrice, description, related, category_id } = req.body;

//         // Parse the related field from JSON string to array of string IDs
//         const parsedRelated = JSON.parse(related);

//         const parseDescription = JSON.parse(description)

//         const newProduct = {
//             productName,
//             productImg: productImg.path,
//             qty_available,
//             productPrice,
//             description:parseDescription,
//             related: parsedRelated,
//             category_id
//         };

//         const product = await Product.create(newProduct);

//         // Update category product count if category_id is provided
//         if (category_id) {
//             await Category.findByIdAndUpdate(category_id, { $inc: { productCount: 1 } });
//         }

//         return correctResponse({
//             res,
//             statusCode: statusCode.OK,
//             msg: messageResponse.ADDED,
//             data: product
//         });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };


// exports.editProduct = async (req, res) => {
//     try {
//         const productId = req.params.productId;
//         const productImg = req.file;
//         const { productName, qty_available, productPrice, description, related, category_id } = req.body;

//         // Find the existing product
//         const existingProduct = await Product.findById(productId);
//         if (!existingProduct) {
//             return correctResponse({
//                 res,
//                 statusCode: statusCode.NOT_FOUND,
//                 msg: messageResponse.NOT_FOUND,
//             })
//         }

//         // Store the existing category_id for comparison
//         const previousCategoryId = existingProduct.category_id;

//         // Parse the description and related fields from JSON strings to objects and arrays
//         const parsedDescription = JSON.parse(description);
//         const parsedRelated = JSON.parse(related);

//         const updatedProductData = {
//             ...(productName && { productName }),
//             ...(productImg && { productImg: productImg.path }),
//             ...(qty_available !== undefined && { qty_available }),
//             ...(productPrice !== undefined && { productPrice }),
//             ...(parsedDescription && { description: parsedDescription }),
//             ...(parsedRelated && { related: parsedRelated }),
//             ...(category_id && { category_id }),
//         };

//         // Update the product
//         const product = await Product.findByIdAndUpdate(productId, updatedProductData, { new: true });

//         // If category_id is updated, update product count in categories
//         if (category_id && category_id.toString() !== previousCategoryId.toString()) {
//             // Decrement product count of previous category
//             await Category.findByIdAndUpdate(previousCategoryId, { $inc: { productCount: -1 } });
//             // Increment product count of new category
//             await Category.findByIdAndUpdate(category_id, { $inc: { productCount: 1 } });
//         }

//         return correctResponse({
//             res,
//             statusCode: statusCode.OK,
//             msg: messageResponse.UPDATED,
//             data: product
//         });

//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// }; 



// exports.getProducts = async (req, res) => {
//     try {
//         // Check if category_id is provided in the query parameters
//         const categoryId = req.query.categoryId;

//         let products;

//         // If categoryId is provided, fetch products by category
//         if (categoryId) {
//             // Retrieve all products with the given category_id
//             products = await Product.find({ category_id: categoryId });
//         } else {
//             // If categoryId is not provided, retrieve all products
//             products = await Product.find();
//         }

//         // If there are no products found, return a 404 Not Found response
//         if (!products || products.length === 0) {
//             return correctResponse({
//                 res,
//                 statusCode: statusCode.NOT_FOUND,
//                 msg: messageResponse.NOT_FOUND,
//             });
//         }

//         // Concatenate the server path with the productImg path in each product
//         const server_path = process.env.SERVER_PATH; // Assuming this is the server path
//         const productsWithFullImagePath = products.map(product => {
//             return {
//                 ...product._doc,
//                 productImg: server_path + product.productImg // Concatenate the server path with productImg path
//             };
//         });

//         // Return the list of products with full image paths
//         return correctResponse({
//             res,
//             statusCode: statusCode.OK,
//             msg: messageResponse.DATA_FETCHED,
//             data: productsWithFullImagePath,
//         });
//     } catch (error) {
//         // If an error occurs during the operation, return a 500 Internal Server Error response
//         return correctResponse({
//             res,
//             statusCode: statusCode.INTERNAL_SERVER_ERROR,
//             msg: error.message
//         });
//     }
// };


// exports.getProductById = async (req, res) => {
//     try {
//         const productId = req.params.productId;

//         // Retrieve the product from the database by its ID
//         const product = await Product.findById(productId).populate("category_id");

//         // If the product is not found, return a 404 Not Found response
//         if (!product) {
//             // return res.status(404).json({ message: "Product not found" });
//             return correctResponse({
//                 res,
//                 statusCode:statusCode.NOT_FOUND,
//                 msg:messageResponse.NOT_FOUND,
//             })
//         }

//         // Concatenate the server path with the productImg path
//         const server_path = process.env.SERVER_PATH; // Assuming this is the server path
//         const productWithFullImagePath = {
//             ...product._doc,
//             productImg: server_path + product.productImg // Concatenate the server path with productImg path
//         };

//         // Return the product with full image path
//         return correctResponse({
//             res,
//             statusCode: statusCode.OK,
//             msg: messageResponse.DATA_FETCHED,
//             data: productWithFullImagePath,
//         });
//     } catch (error) {
//         // If an error occurs during the operation, return a 500 Internal Server Error response
//         return correctResponse({
//             res,
//             statusCode: statusCode.INTERNAL_SERVER_ERROR,
//             msg: error.message
//         });
//     }
// };


// exports.deleteProductById = async (req, res) => {
//     try {
//         const productId = req.params.productId;

//         // Find the product by its ID and delete it
//         const deletedProduct = await Product.findByIdAndDelete(productId);

//         // If the product is not found, return a 404 Not Found response
//         if (!deletedProduct) {
//             return correctResponse({
//                 res,
//                 statusCode: statusCode.NOT_FOUND,
//                 msg: messageResponse.NOT_FOUND,
//             });
//         }

//         // If the product had a category_id, decrement the product count in the associated category
//         if (deletedProduct.category_id) {
//             await Category.findByIdAndUpdate(deletedProduct.category_id, { $inc: { productCount: -1 } });
//         }

//         // Return a success message indicating that the product has been deleted
//         return correctResponse({
//             res,
//             statusCode: statusCode.OK,
//             msg: messageResponse.DELETED,
//             data: deletedProduct,
//         });
//     } catch (error) {
//         // If an error occurs during the operation, return a 500 Internal Server Error response
//         return correctResponse({
//             res,
//             statusCode: statusCode.INTERNAL_SERVER_ERROR,
//             msg: error.message
//         });
//     }
// };

const Product = require('../models/product');
const Category = require('../models/categoryModel');
const { correctResponse, statusCode, messageResponse } = require('../utils/response');

exports.addProduct = async (req, res) => {
    try {
        const productImg = req.file;
        const { productName, sizes, description, related, category_id, is_featured, is_trending } = req.body;

        const parsedRelated = JSON.parse(related);
        const parsedDescription = JSON.parse(description);
        const parsedSizes = JSON.parse(sizes);

        const newProduct = {
            productName,
            productImg: productImg.path,
            sizes: parsedSizes,
            description: parsedDescription,
            related: parsedRelated,
            category_id,
            is_featured,
            is_trending
        };

        const product = await Product.create(newProduct);

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
        console.log(error)
    }
};

// Edit Product
exports.editProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const productImg = req.file;
        const { productName, sizes, description, related, category_id, is_featured, is_trending } = req.body;

        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return correctResponse({
                res,
                statusCode: statusCode.NOT_FOUND,
                msg: messageResponse.NOT_FOUND,
            });
        }

        const previousCategoryId = existingProduct.category_id;

        const parsedDescription = JSON.parse(description);
        const parsedRelated = JSON.parse(related);
        const parsedSizes = JSON.parse(sizes);

        const updatedProductData = {
            ...(productName && { productName }),
            ...(productImg && { productImg: productImg.path }),
            ...(parsedSizes && { sizes: parsedSizes }),
            ...(parsedDescription && { description: parsedDescription }),
            ...(parsedRelated && { related: parsedRelated }),
            ...(category_id && { category_id }),
            ...(is_featured !== undefined && { is_featured }),
            ...(is_trending !== undefined && { is_trending })
        };

        const product = await Product.findByIdAndUpdate(productId, updatedProductData, { new: true });

        if (category_id && category_id.toString() !== previousCategoryId.toString()) {
            await Category.findByIdAndUpdate(previousCategoryId, { $inc: { productCount: -1 } });
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
        console.log(error);
    }
};

// Get Products
// Get Products
exports.getProducts = async (req, res) => {
    try {
        const categoryId = req.query.categoryId;
        
        let products;

        // If categoryId is provided, fetch products by category
        if (categoryId) {
            products = await Product.find({ category_id: categoryId }).populate('category_id');
        } else {
            // If categoryId is not provided, retrieve all products
            products = await Product.find().populate('category_id');
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
        const productsWithFullImagePath = products.map(product => ({
            ...product._doc,
            productImg: server_path + product.productImg // Concatenate the server path with productImg path
        }));

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


// Get Product by ID
exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.productId;

        const product = await Product.findById(productId).populate("category_id");

        if (!product) {
            return correctResponse({
                res,
                statusCode: statusCode.NOT_FOUND,
                msg: messageResponse.NOT_FOUND,
            });
        }

        const server_path = process.env.SERVER_PATH;
        const productWithFullImagePath = {
            ...product._doc,
            productImg: server_path + product.productImg
        };

        return correctResponse({
            res,
            statusCode: statusCode.OK,
            msg: messageResponse.DATA_FETCHED,
            data: productWithFullImagePath,
        });
    } catch (error) {
        return correctResponse({
            res,
            statusCode: statusCode.INTERNAL_SERVER_ERROR,
            msg: error.message
        });
    }
};

// Delete Product by ID
exports.deleteProductById = async (req, res) => {
    try {
        const productId = req.params.productId;

        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return correctResponse({
                res,
                statusCode: statusCode.NOT_FOUND,
                msg: messageResponse.NOT_FOUND,
            });
        }

        if (deletedProduct.category_id) {
            await Category.findByIdAndUpdate(deletedProduct.category_id, { $inc: { productCount: -1 } });
        }

        return correctResponse({
            res,
            statusCode: statusCode.OK,
            msg: messageResponse.DELETED,
            data: deletedProduct,
        });
    } catch (error) {
        return correctResponse({
            res,
            statusCode: statusCode.INTERNAL_SERVER_ERROR,
            msg: error.message
        });
    }
};
