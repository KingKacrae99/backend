const mongoose = require('mongoose');
const { Schema } = mongoose

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    sku: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    description: String,
    category: {
        type: String,
        required: true
    },
    costPrice: {
        type: Number,
        required: true,
        min: 0
    },
    sellPrice: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        default: 0,
        min: 0
    },
    reorderLevel: {
        type: Number,
        default: 5,
        min:0
    },
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date

    },
    { timestamps: true}
);

const products = mongoose.model('product', productSchema);

module.exports = products