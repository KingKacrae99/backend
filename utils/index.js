const mongodb = require('../models/index')
const category = mongodb.category
const utils = {}

/**************************************
 * Error helper function
**************************************/
function createError(status, message) {
    let err = new Error(message)
    err.status = status;
    return err
}

/****************************************
 * Generate store keeping unit
*****************************************/
utils.generateSku = async (products) => {
    let productCat;
    let name;
    let code;

    products.forEach(product => {
        productCat = product.category;
        name = product.name;
    });

    const cat = await category.findById(productCat);

    if (!cat) {
        return null
    }

    if (products.length === 0) {
        code = 1
    } else {
        code = products.length + 1; 
    }
    
    let catCode = cat.substring(0, 3).toUpperCase();
    let nameCode = name.substring(0, 3).toUpperCase();

    const sku = `${catCode}-${nameCode}-00${code}`;

    return sku;
}

// export
module.exports = { utils, createError };

