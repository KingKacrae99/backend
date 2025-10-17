const { body, param } = require('express-validator');
const mongoose = require('mongoose');


const validateCreateOrder = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required.'),

  body('tax')
    .optional()
    .isNumeric()
    .withMessage('Tax must be a number.'),

  body('discount')
    .optional()
    .isNumeric()
    .withMessage('Discount must be a number.'),

  body('items.*.productId')
    .isMongoId()
    .withMessage('Invalid product ID format.'),
  
  body('items.*.quantity')
    .isInt({ gt: 0 })
    .withMessage('Quantity must be a positive integer.'),
];


const validateUpdateOrder = [
  param('id')
    .isMongoId()
    .withMessage('Invalid order ID format.'),

  body('items')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Items must be a non-empty array.'),

  body('tax')
    .optional()
    .isNumeric()
    .withMessage('Tax must be a number.'),

  body('discount')
    .optional()
    .isNumeric()
    .withMessage('Discount must be a number.'),
  
  body('status')
    .optional()
    .isIn(['Pending', 'Shipped', 'Delivered', 'Cancelled'])
    .withMessage('Invalid order status.'),

  body('items.*.productId')
    .optional()
    .isMongoId()
    .withMessage('Invalid product ID format.'),

  body('items.*.quantity')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('Quantity must be a positive integer.'),
];

module.exports = {
  validateCreateOrder,
  validateUpdateOrder
};
