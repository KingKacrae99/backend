const { Types } = require('mongoose');
const mongodb = require('../models/category')
const category = mongodb.category
const { createError } = require('../utils/index')

/************************************************
 *  Retrieve all categories
************************************************/
const getCategories = async (req,res,next) => {
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
const getcategoryById = async (req,res,next) => {
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
const addCategory = async (req,res,next) => {
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
const updateCategoryId = async (req,res,next) => {
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