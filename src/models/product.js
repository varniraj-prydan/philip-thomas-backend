const { ref, required } = require('joi')
const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    productName: { type: String, unique: true, required: true },
    productImg: { type: String, required: true },
    qty_available: { type: Number, required: true },
    productPrice: { type: Number, required: true },
    description: {
        ingredients: { type: String },
        uses: { type: String },
        related: [{ type: mongoose.Schema.Types.ObjectId, ref: "Related" }]
    },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }
}, { timestamps: true });


const Product = mongoose.model('Product',productSchema);

module.exports = Product;