const router = require('express').Router();
const productController = require('../controllers/product');
const wrapper = require('../middleware/wrapper')
const validator = require("../middleware/productValidation");
const { utils } = require('../utils');

router.get('/', wrapper(productController.getProducts))
router.get('/:id', wrapper(productController.getproduct))
router.post('/add',validator.validateAddProduct, utils.handleValidationErrors, wrapper(productController.addProductId))
router.put('/edit/:id', validator.validateAddProduct, utils.handleValidationErrors, wrapper(productController.updateProductId))
router.delete('/delete/:id', wrapper(productController.removeProductId))

module.exports = router;
