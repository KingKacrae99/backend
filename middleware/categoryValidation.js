const { body, param } = require('express-validator');
const { category } = require('../models/category'); 


const validateAddCategory = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required.')
        .isLength({ min: 2 }).withMessage('Category name must be at least 2 characters long.')
        .custom(async value => {
            const existingCategory = await category.findOne({ name: value });
            if (existingCategory) {
                return Promise.reject('A category with this name already exists.');
            }
        })
];

const validateUpdateCategory = [
    param('id').isMongoId().withMessage('Invalid category ID.'),
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required.')
        .isLength({ min: 2 }).withMessage('Category name must be at least 2 characters long.')
        .custom(async (value, { req }) => {
            const existingCategory = await category.findOne({ name: value });
            if (existingCategory && existingCategory._id.toString() !== req.params.id) {
                return Promise.reject('A category with this name already exists.');
            }
        })
];

module.exports = {
    validateAddCategory,
    validateUpdateCategory
};
