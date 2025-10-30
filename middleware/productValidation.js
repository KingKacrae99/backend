const { body, param } = require('express-validator');
const mongoose = require('mongoose');
const { products, supplier } = require('../models/products');


const validateAddProduct = [
    body('name').trim()
        .notEmpty()
        .withMessage('Product name is required.')
        .custom(async (value) => {
        const productExists = await products.findOne({ name: value });
        if (productExists) {
            return Promise.reject('A product with this name already exists.');
           }
        }),
    
    body('description')
        .trim()
        .optional(),
    body('category')
        .trim()
        .notEmpty()
        .withMessage('Product category is required.'),
    body('costPrice')
        .isFloat({ min: 0 })
        .withMessage('Cost price must be a non-negative number.'),
    body('sellPrice').
        isFloat({ min: 0 })
        .withMessage('Sell price must be a non-negative number.'),
    body('quantity')
        .isInt({ min: 0 })
        .notEmpty().withMessage('Field can not be empty')
        .withMessage('Quantity must be a non-negative integer.'),
    body('reorderLevel')
        .isInt({ min: 0 })
        .withMessage('Reorder level must be a non-negative integer.'),
    body('unit')
        .trim()
        .notEmpty()
        .withMessage('Unit of measure is required.')
];


const validateUpdateProduct = [
    param('id')
        .isMongoId()
        .withMessage('Invalid product ID format.'),
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Product name cannot be empty.'),
    body('description')
        .optional()
        .trim(),
    body('category')
        .trim()
        .notEmpty()
        .withMessage('Product category cannot be empty.'),
    body('costPrice')
        .isFloat({ min: 0 })
        .withMessage('Cost price must be a non-negative number.'),
    body('sellPrice')
        .isFloat({ min: 0 })
        .withMessage('Sell price must be a non-negative number.'),
    body('quantity')
        .isInt()
        .withMessage('Quantity must be an integer.'),
    body('reorderLevel')
        .isInt({ min: 0 })
        .withMessage('Reorder level must be a non-negative integer.'),
    body('unit')
        .trim()
        .notEmpty()
        .withMessage('Unit of measure cannot be empty.'),


    body('supplierId').optional().custom(async (value) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return Promise.reject('Invalid supplier ID format.');
        }
        const supplierExists = await supplier.findById(value);
        if (!supplierExists) {
            return Promise.reject('Supplier not found.');
        }
    })
];

module.exports = {
    validateAddProduct,
    validateUpdateProduct
};
