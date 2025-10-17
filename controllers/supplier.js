const mongodb = require("../models/")
const supplier = mongodb.supplier
const { createError } = require("../utils/index")
const Types = mongodb.mongoose.Types

/***********************************************
 * Create Supplier
************************************************/

/* 
#swagger.tags = [Suppliers]
#swagger.description = 'Create Product Supplier'
#swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: { $ref: '#/definitions/Supplier' }
}
#swagger.responses[200] = {
    description:'Supplier successfully created'
    schema: {$ref: '#/definitions/Supplier'}
}
#swagger.responses[400] = {
    description:'Failed to add supplier',
    schema: {$ref: '#/definitions/Error'}
}
*/
const addSupplier = async (req, res, next) => {
    try {
        if (!req.body) {
            throw createError(400,"Supplier data not provide")
        }

        const { contactName, email, phone, address, productsSupplied } = req.body;

        if (!contactName || !phone || !address || !productsSupplied && productsSupplied.length === 0)
            return next(createError(400, "Pls provide data for all required field"));

        if (email == '') { email = null}

        const supplierExist = await supplier.findOne({
            contactName: contactName,
            email: email,
            phone: phone,
            address: address,
            productsSupplied: productsSupplied
        });
        if (supplierExist) {
            return res.status(409).json({
                status: "fail",
                message: `Supplier already exists ${supplierExist}`
            });
        }
        const newSupplier = await supplier.create({
            contactName: contactName,
            phone: phone,
            address: address,
            productsSupplied: productsSupplied
        });

        if (!newSupplier) {
            throw createError(400, "Request failed. Supplier was not added");
        }
        return res.status(201).json({
            status: "success",
            message: "Supplier added successfully",
            result: newSupplier
        });

    } catch (error) {
        next(error)
    }
}

/**************************************************
 * Update supplier
**************************************************/

/* 
#swagger.tags = [Supplier]
#swagger.description = 'Update supplier information by unique ID'
#swagger.parameters['id'] = {
    in: 'path',
    description: 'ID of the supplier's information to update.',
    required: true,
    type: 'integer'
}
#swagger.responses[200]={
    description:'Updated successfully'
    schema: {$ref: '#/definitions/Supplier'}
}
#swagger.responses[400] = {
    description:'Update failed',
    schema: {$ref: '#/definitions/Error'}
}
*/
const updateSupplier = async (req, res, next) => {
    try {
        const supplierID = req.params.id;
        if (!Types.ObjectId.isValid(supplierID)) throw createError(400, "Bad Request! ID is invalid");

        if (!req.body || req.body.productsSupplied.length === 0) {
            return next(createError(400, "Data or productsSupplied not provided"));
        }
        
        const { contactName, phone, email, address, productsSupplied } = req.body;

        const supplierExists = await supplier.findById(supplierID);
        if (!supplierExists) return next(createError(404, "Supplier not found"));

        if (!contactName || !phone || !address || !productsSupplied)
            return next(createError(400, "Pls provide all required data"));
        
        if (!email) email = null;

        const filter = { _id: supplierID }
        const update = {
            contactName: contactName,
            email: email,
            phone: phone,
            address: address,
            productsSupplied: productsSupplied
        }
        const newSupplier = await supplier.updateOne(filter, update);
        if (newSupplier.modifiedCount === 0) {
            throw createError(400,"Supplier update failed")
        }

        return res.status(200).json({
            status: "success",
            message: "Supplier successfully updated",
            result: newSupplier
        })

    } catch (error) {
        next(error)
    }
}

/**********************************************
 * Retrieve Supplier By ID
***********************************************/

/* 
#swagger.tags = [Supplier]
#swagger.description = 'Retrieve supplier by unique ID'
#swagger.parameters['id'] = {
    in: 'path',
    description: 'ID of the user to retrieve.',
    required: true,
    type: 'integer'
}
#swagger.responses[200]={
    description:'Supplier details'
    schema: {$ref: '#/definitions/Supplier'}
}
#swagger.responses[400] = {
    description:'Supplier not found',
    schema: {$ref: '#/definitions/Error'}
}
*/
const getSupplier = async (req, res, next) => {
    try {
        const supplierID = req.params.id;
        if (!Types.ObjectId.isValid(supplierID))
            return next(createError(400, "Bad Request! ID is invalid"));

        const supplierExist = await supplier.findById(supplierID);
        if (!supplierExist) return next(createError(404, "Supplier not found"));

        return res.status(200).json({
            status: "success",
            message: "Supplier found",
            result: supplierExist
        });

    } catch (error) {
        next(error)
    }
}

/************************************************
 * Delete Supplier
*************************************************/

/* 
#swagger.tags = [Supplier]
#swagger.description = 'Delete Supplier by unique ID'
#swagger.parameters['id'] = {
    in: 'path',
    description: 'ID of the supplier to delete',
    required: true,
    type: 'integer'
}
#swagger.responses[200]={
    description:'Delete successfully'
    schema: {$ref: '#/definitions/Supplier'}
}
#swagger.responses[400] = {
    description:'Delete failed',
    schema: {$ref: '#/definitions/Error'}
}
*/
const deleteSupplier = async (req, res, next) => {
    try {
        const supplierID = req.params.id;
        if (!Types.ObjectId.isValid(supplierID))
            return next(createError(400, "Bad Request! ID is invalid"));

        const supplierExist = await supplier.findByIdAndDelete(supplierID);
        if (!supplierExist) return next(createError(404, "Supplier not found or has already been deleted"));

        return res.status(200).json({
            status: "success",
            message: "Supplier found",
            result: supplierExist
        });

    } catch (error) {
        next(error)
    }
}

/*************************************************
 * Get All Suppliers
**************************************************/

/* 
#swagger.tags = [Supplier]
#swagger.description = 'Retrieve all suppliers'
#swagger.responses[200]={
    description:'Suppliers found'
    schema: {$ref: '#/definitions/Supplier'}
}
#swagger.responses[400] = {
    description:'Supplier failed',
    schema: {$ref: '#/definitions/Error'}
}
*/
const getAllSupplier = async (req, res, next) => {
    try {
        const allSupplier = await supplier.find().sort({ createdAt: 1 });
        if (allSupplier.length === 0) {
            return next(createError(404,"No data found"))
        }

        return res.status(200).json({
            status: "success",
            message: "Suppliers Found",
            result: allSupplier
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    addSupplier,
    updateSupplier,
    getSupplier,
    getAllSupplier,
    deleteSupplier
}