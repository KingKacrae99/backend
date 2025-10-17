const mongoose = require('mongoose');
const { Schema } = mongoose

const userSchema = new Schema({
    googleId: {
        type: String,
        required: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    picture: {
        type: String,
        required: true
    },
    local: String,
    locale: String,
    role: {
        type: String,
        enum: ['Admin', 'Manager', 'Staff', 'Client'],
        default: 'Client'
    },
    joinedAt: Date

});

const users = mongoose.model('users', userSchema);

module.exports = users
