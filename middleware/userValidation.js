const { body, param } = require('express-validator');
const { users } = require('../models');

const UserRules = [
    param('id').isMongoId().withMessage('Invalid user ID format.'),

    body('googleId')
        .notEmpty()
        .withMessage('googleId not provided'),
    
    body('fullName')
        .trim()
        .notEmpty()
        .withMessage('Full name cannot be empty.'),
    
    body('email')
        .isEmail().withMessage('Invalid email format.')
        .custom(async (email, { req }) => {
            const existingUser = await users.findOne({ email });
            // Check if the email is already in use by another user
            if (existingUser && existingUser._id.toString() !== req.params.id) {
                throw new Error('Email is already in use.');
            }
        }),
    
    body('picture')
        .notEmpty()
        .isURL()
        .withMessage('Picture must be a valid URL.'),

    body('locale')
        .optional(),
    body('role')
        .optional()
        .isIn(['Admin', 'Manager', 'Staff','Client']).withMessage('Invalid user role.'),

];

module.exports = {
    UserRules
};