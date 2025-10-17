const { body, param } = require('express-validator');
const { users } = require('../models'); // Adjust path to your User model

const UserRules = [
    param('id').isMongoId().withMessage('Invalid user ID format.'),

    body('email')
        .isEmail().withMessage('Invalid email format.')
        .custom(async (email, { req }) => {
            const existingUser = await users.findOne({ email });
            // Check if the email is already in use by another user
            if (existingUser && existingUser._id.toString() !== req.params.id) {
                throw new Error('Email is already in use.');
            }
        }),

    body('fullName')
        .trim()
        .notEmpty().withMessage('Full name cannot be empty.'),

    body('role')
        .optional()
        .isIn(['admin', 'editor', 'user']).withMessage('Invalid user role.'),

    // 5. Google ID and picture are typically not updated manually.
    // We can omit validation or add checks for their existence.
    body('googleId').optional(),
    body('picture').optional().isURL().withMessage('Picture must be a valid URL.'),
];

module.exports = {
    UserRules
};