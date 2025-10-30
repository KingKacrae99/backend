const { body, param } = require('express-validator');
const mongoose = require('mongoose');
const mongodb = require('../models/index')
const { supplier } = mongodb; 

const validationHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'fail', errors: errors.array() });
    }
    next();
};


const validateAddSupplier = [
    body('name')
        .trim()
        .notEmpty().withMessage('supplier name is required.')
        .isLength({ min: 3 }).withMessage('Supplier name must be at least 3 characters long.')
        .custom(async value => {
            const existingSupplier = await supplier.findOne({ name: value });
            if (existingSupplier) {
                throw new Error('A supplier with this name already exists.');
            }
        }),
        
    body('email')
        .optional({ checkFalsy: true }) 
        .isEmail().withMessage('Invalid email format.'),
    
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required.')
        .custom(async value => {
            const existingSupplier = await supplier.findOne({ phone: value });
            if (existingSupplier) {
                throw new Error('A supplier with this phone number already exists.');
            }
        }),

    body('address')
        .trim()
        .notEmpty().withMessage('Address is required.'),

    body('productsSupplied')
        .isArray({ min: 1 }).withMessage('At least one product must be supplied.')
        .withMessage('productsSupplied must be an array.'),
];


const validateUpdateSupplier = [
    // Validate the supplier ID from the URL params
    param('id')
        .isMongoId().withMessage('Invalid supplier ID format.'),
    
    body('name')
        .optional()
        .trim()
        .notEmpty().withMessage('name cannot be empty.'),
    
    
    body('email')
        .optional({ checkFalsy: true })
        .isEmail().withMessage('Invalid email format.'),
    
    
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number cannot be empty.')
        .custom(async value => {
                const existingSupplier = await supplier.findOne({ phone: value });
                if (existingSupplier) {
                    throw new Error('A supplier with this phone number already exists.');
                }
            }),
        
    
    body('address')
        .trim()
        .notEmpty().withMessage('Address cannot be empty.'),
    
    
    body('productsSupplied')
        .optional()
        .isArray({ min: 1 }).withMessage('productsSupplied must be a non-empty array.'),
];

module.exports = {
    validateAddSupplier,
    validateUpdateSupplier,
    validationHandler, 
};
