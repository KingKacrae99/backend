const mongodb = require('../models/index');
const users = mongodb.users
const {createError}= require('../utils/index')
const Types = mongodb.mongoose.Types



/******************************************
 *  Retrieve all users
*******************************************/

/*
#swagger.tags = [users]
#swagger.description = 'Retrieve all users'
#swagger.responses[200] = {
     description:"All users",
     schema:{#ref: '#/definitions/users'}
}
#swagger.responses[404] = {
    description: "Users not found",
    schema: {#ref: '#/definitions/Error'}
}
*/
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

/* 
#swagger.tags = [users]
#swagger.description = 'Update user information by  their ID'
#swagger.parameters['id'] = {
    in: 'path',
    description: 'ID of the user to be updated.',
    required: true,
    type: 'integer'
}
#swagger.responses[200]={
    description:'Updated successfully'
    schema: {$ref: '#/definitions/users'}
}
#swagger.responses[400] = {
    description:'Update failed',
    schema: {$ref: '#/definitions/Error'}
}
*/
const updateUser = async (req, res, next) => {
    try {
        const { id: userId } = req.params;
        const { googleId, fullName, email, picture, role } = req.body;

        const updateInfo = {
            ...(fullName && { fullName }),
            ...(email && { email }),
            ...(picture && { picture }),
            ...(role && { role }),
        };

        const updatedUser = await users.findByIdAndUpdate(
            userId,
            updateInfo,
            { 
                new: true,
                runValidators: true, 
            }
        );

        if (!updatedUser) {
            return next(createError(404, 'User does not exist.'));
        }

        return res.status(200).json({
            status: 'success',
            message: 'User was successfully updated.',
            result: updatedUser
        });

    } catch (err) {
        next(err);
    }
};

/****************************************
 * Retrieve user by ID
****************************************/

/* 
#swagger.tags = [users]
#swagger.description = 'Retrieve user's information by their ID'
#swagger.parameters['id'] = {
    in: 'path',
    description: 'ID of the user to retrieve.',
    required: true,
    type: 'integer'
}
#swagger.responses[200] = {
    description:'User detail'
    schema: {$ref: '#/definitions/users'}
}
#swagger.responses[400] = {
    description:'User not found',
    schema: {$ref: '#/definitions/Error'}
}
*/
const getUser = async (req, res, next) => {
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

/* 
#swagger.tags = [users]
#swagger.description = 'Delete user by their unique ID'
#swagger.parameters['id'] = {
    in: 'path',
    description: 'ID of the user to Delete.',
    required: true,
    type: 'integer'
}
#swagger.responses[200]={
    description:'Delete successfully'
    schema: {$ref: '#/definitions/users'}
}
#swagger.responses[400] = {
    description:'Delete failed',
    schema: {$ref: '#/definitions/Error'}
}
*/
const removeUser = async (req, res, next) => {
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