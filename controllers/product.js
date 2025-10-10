const mongodb = require('../models/index')
const { utils, createError } = require('../utils/index')
const products = mongodb.products
const Types = mongodb.mongoose.Types

/********************************************
 * Retrieve All Products
**********************************************/
const getProducts = async (req,res,next) => {
    try {
        const allProduct = await products.find().sort({ _id: -1 })
        if (allProduct.length < 1) {
            return next(createError(404,"No product found!"))
        }

        return res.status(200).json({
            status: 'success',
            message: 'Products found',
            result: allProduct
        });

    } catch (err) {
        next(err)
    }
}

/******************************************
 *  Retrieve Product By ID
*******************************************/
const getproduct =async (req,res,next) => {
    try {
        const productId = req.params.id;
        if (Types.ObjectId.isValid(productId)) {
            return next(createError(400,"Invalid Id"))
        }

        const productInfo = await products.findById(productId)
        if (!productInfo) {
            return next(createError(404,"Product not found!"))
        }

        return res.status(200).json({
            status: "success",
            message: "Product found!",
            result: productInfo
        });

    } catch (error) {
        next(error)
    }
}

/**************************************************
 * Add product By ID
**************************************************/
const addProductId= async (req,res,next) => {
    try {
        if (!req.body){
            return next(createError(400, "No data was provided"));
        }
        const allProduct = await products.find();
        const sku = await utils.generateSku(allProduct)

        if (!sku) { return next(createError(400, "Failed to generate Store Keeping Unit(SKU)")) }

        const currentDate = new Date();
        const wasAdded = currentDate.toISOString();

        const productInfo = {
            name: req.body.name,
            sku: sku,
            description: req.body.description,
            category: req.body.category,
            costPrice: req.body.costPrice,
            sellPrice: req.body.costPrice,
            quantity: req.body.quantity,
            reorderLevel: req.body.reorderLevel,
            supplierId: req.body.supplierId,
            unit: req.body.unit,
            createdAt: wasAdded,
            updatedAt: null
        }

        const newProduct = await products.create(productInfo);
        if (!newProduct) {
            return next(createError(400,'Product creation process failed.'))
        }

        return res.status(200).json({
            status: 'success',
            message: 'Product created successfully',
            result: newProduct
        });

    } catch (error) {
        
    }
}

/******************************************
 * Update Product by ID
*******************************************/
const updateProductId = async (req,res,next) => {
    try {
        const productId = req.params.id;
        if (!Types.ObjectId.isValid(productId)) {
            return next(createError(400, 'Invalid product ID'));
        }

        // retrieve data
        const data = await products.findById(productId);

        if (!data) {
            return next(createError(400,"Product not found"))
        }
        const currentDate = new Date();
        const date = currentDate.toISOString()

        const productInfo = {
            name: req.body.name,
            sku: sku,
            description: req.body.description,
            category: req.body.category,
            costPrice: req.body.costPrice,
            sellPrice: req.body.costPrice,
            quantity: req.body.quantity,
            reorderLevel: req.body.reorderLevel,
            supplierId: req.body.supplierId,
            unit: req.body.unit,
            updatedAt: date
        }

        const filter= {_id: productId}
        const updatedProduct = await products.replaceOne(filter, productInfo)
        if (updatedProduct.modifiedCount === 0) {
            return next(createError(400,"Updating process failed"))
        }

        return res.status(200).json({
            status: 'success',
            message: 'Product Successfully Updated',
            result: updatedProduct
        })

    } catch (error) {
        next(error)
    }
}

/************************************************
 * Delete Product By ID 
*************************************************/
const removeProductId = async (req,res,next) => {
    try {
        const productId = req.params.id;
        if (!Types.ObjectId.isValid(productId)) {
            return next(createError(400,'Invalid ID'))
        }
        const deletedProduct = await products.findByIdAndDelete(productId)
        if (!deletedProduct) {
            return next(createError(404,'Product does not exist'))
        }
        return res.status(200).json({
            status: 'success',
            message: 'Product successfully deleted',
            result: deletedProduct
        });

    } catch (error) {
        next(error)
    }
}

module.exports = {
    getProducts,
    getproduct,
    addProductId,
    updateProductId,
    removeProductId
}