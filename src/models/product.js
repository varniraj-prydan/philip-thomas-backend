const { required } = require('joi');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { type: String, unique: true, required: true },
    productShortDescription: {type:String,required:true},
    productImg: { type: String },
    sizes: [{
        size: { type: String, required: true },
        price: { type: Number, required: true },
        qty_available: { type: Number, required: true }
    }],
    description: {
        ingredients: { type: String },
        uses: { type: String },
    },
    related: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    is_featured: { type: Boolean, default: false },
    is_trending: { type: Boolean, default: false }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
