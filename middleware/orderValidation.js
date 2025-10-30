const { body, param } = require('express-validator');
const { order } = require('../models')

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
    .isArray({ min: 1 })
    .withMessage('Items must be a non-empty array.'),

  body('tax')
    .isNumeric()
    .withMessage('Tax must be a number.'),

  body('discount')
    .isNumeric()
    .withMessage('Discount must be a number.'),
  
  body('status')
    .isIn(['Pending', 'Paid'])
    .withMessage('Invalid order status.'),

  body('items.*.productId')
    .isMongoId()
    .withMessage('Invalid product ID format.'),

  body('items.*.quantity')
    .isInt({ gt: 0 })
    .withMessage('Quantity must be a positive integer.'),
];

module.exports = {
  validateCreateOrder,
  validateUpdateOrder
};
