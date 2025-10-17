const mongodb = require('../models/index')
const { utils, createError } = require('../utils/index')
const products = mongodb.products
const Types = mongodb.mongoose.Types
const invAudit = require('./inventoryAudit')


/********************************************
 * Retrieve All Products
**********************************************/

/* 
#swagger.tags = [Product]
#swagger.description = 'Retrieve all the products'
#swagger.responses[200]={
    description:'All Products'
    schema: {$ref: '#/definitions/Product'}
}
#swagger.responses[400] = {
    description:'Products not found',
    schema: {$ref: '#/definitions/Error'}
}
*/
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

/* 
#swagger.tags = [Product]
#swagger.description = 'Retrieve product by unique ID'
#swagger.parameters['id'] = {
    in: 'path',
    description: 'ID of the product to retrieve.',
    required: true,
    type: 'integer'
}
#swagger.responses[200]={
    description:'Product details'
    schema: {$ref: '#/definitions/Product'}
}
#swagger.responses[400] = {
    description:'Product not found',
    schema: {$ref: '#/definitions/Error'}
}
*/
const getproduct = async (req, res, next) => {
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

/* 
#swagger.tags = [Products]
#swagger.description = 'Create new product by unique ID'
#swagger.parameters['body'] = {
    in: 'body',
    description: 'Product information',
    required: true,
    schema: { $ref: '#/definitions/Product' }
}
#swagger.responses[201]={
    description:'Product created Successfully'
    schema: {$ref: '#/definitions/Product'}
}
#swagger.responses[400] = {
    description:'Product creation failed',
    schema: {$ref: '#/definitions/Error'}
}
*/
const addProductId = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, description, category, costPrice, sellPrice, quantity, reorderLevel, supplierId, unit } = req.body;
        
        const sku = await utils.generateSku(name, category, session);
        if (!sku) {
            throw new Error("Failed to generate Store Keeping Unit(SKU)");
        }

        const newProduct = await products.create([{
            name,
            sku,
            description,
            category,
            costPrice,
            sellPrice,
            quantity,
            reorderLevel,
            supplierId,
            unit
        }], { session });
        
        await session.commitTransaction();

        return res.status(201).json({
            status: 'success',
            message: 'Product created successfully',
            result: newProduct[0] 
        });

    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};

/******************************************
 * Update Product by ID
*******************************************/

/* 
#swagger.tags = [Product]
#swagger.description = 'Update product by unique ID'
#swagger.parameters['id'] = {
    in: 'path',
    description: 'ID of the product to be updated.',
    required: true,
    type: 'integer'
}
#swagger.responses[200]={
    description:'Updated Successfully'
    schema: {$ref: '#/definitions/Product'}
}
#swagger.responses[400] = {
    description:'Update Failed',
    schema: {$ref: '#/definitions/Error'}
}
*/
const updateProductId = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id: productId } = req.params;

        if (!Types.ObjectId.isValid(productId)) {
            throw createError(400, 'Invalid product ID.');
        }

        const productToUpdate = await products.findById(productId).session(session);

        if (!productToUpdate) {
            throw createError(404, 'Product not found.');
        }
        
        if (!req.body) {
            throw createError(400, 'No data was provided for the update.');
        }

        const {
            name,
            sku,
            description,
            category,
            costPrice,
            sellPrice,
            quantity: newQuantity, 
            reorderLevel,
            supplierId,
            unit
        } = req.body;
        
        if (supplierId && !Types.ObjectId.isValid(supplierId)) {
            throw createError(400, 'Please provide a valid supplier ID.');
        }


        const quantityChange = newQuantity - productToUpdate.quantity;
        if (isNaN(quantityChange)) {
            throw createError(400, 'New quantity must be a valid number.');
        }

        // Ensure the quantity doesn't become negative
        if (productToUpdate.quantity + quantityChange < 0) {
            throw createError(400, `Insufficient stock. Current: ${productToUpdate.quantity}, Change: ${quantityChange}`);
        }
        
        // Find the supplier name for the audit log
        let supplierName = 'N/A';
        if (supplierId) {
            const supplierInfo = await supplier.findById(supplierId).session(session);
            if (supplierInfo) {
                supplierName = supplierInfo.contactName;
            }
        }
        
        const updatedProduct = await products.findByIdAndUpdate(
            productId,
            {
                name,
                sku,
                description,
                category,
                costPrice,
                sellPrice,
                quantity: productToUpdate.quantity + quantityChange,
                reorderLevel,
                supplierId,
                unit,
                updatedAt: new Date() 
            },
            { new: true, runValidators: true, session }
        );

        if (!updatedProduct) {
            throw createError(400, 'Updating process failed.');
        }

        const auditAction = quantityChange > 0 ? 'Add Stock' : 'Adjustment';

        const newAudit = {
            productId: updatedProduct._id,
            userId: req.user._id,
            action: auditAction,
            quantityChanged: quantityChange,
            note: `${auditAction} for product ${updatedProduct._id} by ${req.user.fulName}. Supplied by: ${supplierName}`,
        };

        await invAudit.createInvAudit(newAudit, session);
        
        await session.commitTransaction();

        return res.status(200).json({
            status: 'success',
            message: 'Product successfully updated',
            result: updatedProduct
        });

    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};


/************************************************
 * Delete Product By ID 
*************************************************/
/* 
#swagger.tags = [Product]
#swagger.description = 'Remove product by unique ID'
#swagger.parameters['id'] = {
    in: 'path',
    description: 'ID of the product to be Deleted.',
    required: true,
    type: 'integer'
}
#swagger.responses[200]={
    description:'Product Successfully Delete'
    schema: {$ref: '#/definitions/Product'}
}
#swagger.responses[400] = {
    description:'Delete Failed',
    schema: {$ref: '#/definitions/Error'}
}
*/
const removeProductId = async (req, res, next) => {
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