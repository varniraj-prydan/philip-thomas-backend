const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
        },
        quantity: { type: Number, required: true, min: 1 }
    }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
},{
    timestamps:true
})

module.exports = mongoose.model('Cart', cartSchema);