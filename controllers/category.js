const { Types } = require('mongoose');
const mongodb = require('../models/category')
const category = mongodb.category
const { createError } = require('../utils/index')

/************************************************
 *  Retrieve all categories
************************************************/

/* 
#swagger.tags = [Category]
#swagger.description = 'Retrieve all product categories'
#swagger.responses[200]={
    description:'Categories found'
    schema: {$ref: '#/definitions/Category'}
}
#swagger.responses[400] = {
    description:'Categories not found',
    schema: {$ref: '#/definitions/Error'}
}
*/
const getCategories = async (req, res, next) => {
    try {
        const categories = await category.find();
        if (categories === 0) {
            return next(createError(404,'Data available'))
        }
        return res.status.json({
            status: 'success',
            message: 'Category successfully retrieved',
            result: categories
        })
    } catch (err) {
        next(err)
    }
}

/********************************************
 *  Retrieve Category By ID
*********************************************/

/* 
#swagger.tags = [Category]
#swagger.description = 'Retrieve category by unique ID'
#swagger.parameters['id'] = {
    in: 'path',
    description: 'ID of the category to  be retrieved.',
    required: true,
    type: 'integer'
}
#swagger.responses[200]={
    description:'Category details'
    schema: {$ref: '#/definitions/Category'}
}
#swagger.responses[400] = {
    description:'Category not found',
    schema: {$ref: '#/definitions/Error'}
}
*/
const getcategoryById = async (req, res, next) => {
    try {
        const catId = req.params.catId
        if (!Types.ObjectId.isValid(catId)) {
            return next(createError(400,"Invalid ID"))
        }
        const getCategory = await category.findById(catId);
        if (!getCategory) {
            return next(createError(404,'Category not found!'))
        }
        return res.status(404).json({
            status: 'success',
            message: 'Category found!',
            result: getCategory
         })

     } catch (err) {
        next(err)
    }
}

/*******************************************
 *  ADD CATEGORY
********************************************/

/* 
#swagger.tags = [Categories]
#swagger.description = 'Create Category'
#swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: { $ref: '#/definitions/Category' }
}
#swagger.responses[201]={
    description:'Category Created Successfully'
    schema: {$ref: '#/definitions/Category'}
}
#swagger.responses[400] = {
    description:'Category creation failed',
    schema: {$ref: '#/definitions/Error'}
}
*/
const addCategory = async (req, res, next) => {
    try {
        if (!req.body) {
            return next(createError(400,"No data was provided"))
        }
        const categoryinfo = {
            name: req.body.name
        }
        const newCategory = await category.create(categoryinfo)
        if (!newCategory) {
            return next(createError(400,'Failed to add category'))
        }

        return res.status(200).json({
            status: 'success',
            message: 'Category was sucessfully added',
            result: newCategory
        })

    } catch (err) {
        
    }
}

/******************************************
 *  UPDATE CATEGORY BY ID
******************************************/

/* 
#swagger.tags = [Category]
#swagger.description = 'Update category by unique ID'
#swagger.parameters['id'] = {
    in: 'path',
    description: 'ID of the category to  be updated.',
    required: true,
    type: 'integer'
}
#swagger.responses[200]={
    description:'Updated Successfully'
    schema: {$ref: '#/definitions/Category'}
}
#swagger.responses[400] = {
    description:'Update failed',
    schema: {$ref: '#/definitions/Error'}
}
*/
const updateCategoryId = async (req, res, next) => {
    try {
        const catId = req.params.id;
        if (!Types.ObjectId.isValid(catId)) {
            return next(createError(400,"Pls Provide a valid ID"))
        }

        const oldCategory = await category.findById(catId);
        if (!oldCategory) {
            return next(createError(404,'Category not found'))
        }
        
        const update = {
            name: req.body.name
        }
        const filter = { _id: catId }
        
        const updatedCategory = await category.replaceOne(filter, update)
        if (updatedCategory.modifiedCount === 0) {
            return next(createError(400,'Category was not updated, try again.'))
        }

        return res.status(200).json({
            status: 'success',
            message: 'Category was successfully updated',
            result: updatedCategory
        })

    } catch (error) {
        next(err)
    }
}

/************************************************
 * Delete Category By ID 
*************************************************/

/* 
#swagger.tags = [Category]
#swagger.description = 'Delete category by unique ID'
#swagger.parameters['id'] = {
    in: 'path',
    description: 'ID of the category to  be deleted.',
    required: true,
    type: 'integer'
}
#swagger.responses[200]={
    description:'Deleted Successfully'
    schema: {$ref: '#/definitions/Category'}
}
#swagger.responses[400] = {
    description:'Delete failed',
    schema: {$ref: '#/definitions/Error'}
}
*/
const removeCategoryId = async (req, res, next) => {
    try {
        const catId = req.params.id;
        if (!Types.ObjectId.isValid(catId)) {
            return next(createError(400, 'Invalid ID'))
        }
        const removedCategory = await category.findByIdAndDelete(catId)
        if (!removedCategory) {
            return next(createError(404, 'This category do not exist'))
        }
        return res.status(200).json({
            status: 'success',
            message: 'Category successfully deleted',
            result: removedCategory
        });

    } catch (error) {
        next(error)
    }
}

module.exports = {
    getCategories,
    getcategoryById,
    addCategory,
    updateCategoryId,
    removeCategoryId
}