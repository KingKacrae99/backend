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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
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
    unit: {
        type: String,
        enum: ['Pieces', 'Packs', 'Dozen', 'Box'],
        default: 'Pieces',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date

    },
    { timestamps: true}
);

const products = mongoose.model('Product', productSchema);

module.exports = products