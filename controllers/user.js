const mongodb = require('../models/index');
const users = mongodb.users
const {createError}= require('../utils/index')
const Types = mongodb.mongoose.Types

/******************************************
 *  Retrieve all users
*******************************************/
const getUsers = async (req,res,next) => {
    try {

        const allUsers = await users.find().sort({ _id: -1 });

        if (allUsers.length > 0) {
            return res.status(200).json({
                status: 'success',
                result: allUsers
            }); 
        }
        return next(createError(404,"No data found"))
    } catch (err) {
        next(err)
    }
}

/*************************************************
 * Update user by Id 
*************************************************/
const updateUser= async (req,res,next) => {
    try {
        const userId = req.params.id;
        if (!Types.ObjectId.isValid(userId)) {
            return  next(createError(400,'Invalid user Id'))
        }
        const existingUser = await users.findById(userId)
        if (!existingUser) {
            return next(createError(404, "User does not exist"))
        }
        const newInfo = {
            googleId: req.body.googleId,
            fullName: req.body.fullName,
            email: req.body.email,
            picture: req.body.picture,
            role: req.body.role
        }

        //Update retrieved data
        const filter = { _id: userId };
        const updateUser = await users.replaceOne(filter, newInfo);

        if (updateUser.modifiedCount === 0) {
            return next(createError(400,"Updated process failed!"))
        }

        return res.status(200).json({
            status: 'success',
            message: 'Update was successful',
            result: updateUser
        });

     } catch (err) {
        next(err)
    }
}

/****************************************
 * Retrieve user by ID
****************************************/
const getUser= async (req,res,next) => {
    try {
        // get ID from req.params
        const userId = req.params.id;
        if (!Types.ObjectId.isValid(userId)) {
            return next(createError(400,"Invalid user Id"))
        }

        // get user info
        const userInfo = await users.findById(userId);
        if (!userInfo) {
            return next(createError(404,'User not found!'))
        }

        return res.status(200).json({
            status: 'success',
            message: "User found!",
            result: userInfo
        });

    } catch (err) {
        next(err)
    }
}

/***************************************
 *  Delete User 
****************************************/
const removeUser= async (req,res,next) => {
    try {
        const userId = req.params.id;
        if (Types.ObjectId.isValid(userId)) {
            return next(createError(400,"Invalid ID"))
        }
        const deletedUser = await users.findByIdAndDelete(userId);
        if (!deletedUser) {
            return next(createError(404, "Delete process failed! maybe user has already been deleted"))
        }
        return res.status(200).json({
            status: 'success',
            message: 'User successfully deleted',
            result: deletedUser
        })
    } catch (err) {
        next(err)
    }
}

module.exports = {
    getUsers,
    updateUser,
    getUser,
    removeUser
}