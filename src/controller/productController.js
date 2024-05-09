const Product = require("../models/product");
const { correctResponse, statusCode, messageResponse } = require("../utils/response");


exports.addProduct = async (req, res) => {
    try {
        // Get the uploaded file details from req.file
        const productImg = req.file;
        // Assuming other fields are coming from req.body
        const { productName, qty_available, productPrice, description, category_id } = req.body;

        // Construct new product object with both file details and other fields
        const newProduct = {
            productName,
            productImg: productImg.path, // Save the path of the uploaded file
            qty_available,
            productPrice,
            description,
            category_id
        };

        const product = await Product.create(newProduct);
        // res.status(201).json({ message: 'Product Created Successfully!', product });
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

exports.editProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        // Get the uploaded file details from req.file
        const productImg = req.file;
        // Assuming other fields are coming from req.body
        const { productName, qty_available, productPrice, description, category_id } = req.body;

        // Construct updated product object with new data
        const updatedProductData = {
            ...(productName && { productName }),
            ...(productImg && { productImg: productImg.path }),
            ...(qty_available !== undefined && { qty_available }),
            ...(productPrice !== undefined && { productPrice }),
            ...(description && { description }),
            ...(category_id && { category_id }),
        };

        // Update the product using spread operator to merge existing product data with updated data
        const product = await Product.findByIdAndUpdate(productId, updatedProductData, { new: true });

        if (!product) {
            return correctResponse({
                res,
                statusCode:statusCode.NOT_FOUND,
                msg:messageResponse.NOT_FOUND,
            })
        }

        // res.status(200).json({ message: 'Product updated successfully!', product });
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
        // Retrieve all products from the database
        const products = await Product.find();

        // If there are no products found, return a 404 Not Found response
        if (!products || products.length === 0) {
            return correctResponse({
                res,
                statusCode:statusCode.NOT_FOUND,
                msg:messageResponse.NOT_FOUND,
            })
        }

        // Concatenate the server path with the productImg path in each product
        const server_path = process.env.SERVER_PATH ; // Assuming this is the server path
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
        const product = await Product.findById(productId);

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
                statusCode:statusCode.NOT_FOUND,
                msg:messageResponse.NOT_FOUND,
            })
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
