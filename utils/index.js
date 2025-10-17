const mongodb = require('../models/index')
const utils = {}
const { validationResult } = require('express-validator');

/**************************************
 * Error helper function
**************************************/
function createError(status, message) {
    let err = new Error(message)
    err.status = status;
    return err
}

// Middleware to handle validation results
utils.handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'fail', errors: errors.array() });
    }
    next();
};

/****************************************
 * Generate store keeping unit
*****************************************/
utils.generateSku = async (product,category) => {
    let productCat = category;
    let name = product;
    let code;

    const cat = await mongodb.category.findById(productCat);

    if (!cat) {
        return null
    }

    const allProduct = await mongodb.products.find()

    if (allProduct.length === 0) {
        code = 1
    } else {
        code = allProduct.length + 1; 
    }
    
    let catCode = cat.substring(0, 3).toUpperCase();
    let nameCode = name.substring(0, 3).toUpperCase();

    const sku = `${catCode}-${nameCode}-00${code}`;

    return sku;
}

// export
module.exports = { utils, createError };

