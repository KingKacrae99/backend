const router = require('express').Router();
const productController = require('../controllers/product');
const wrapper = require('../middleware/wrapper')
const validator = require("../middleware/productValidation");
const { utils } = require('../utils');
const privilege = require("../middleware/auth")

router.get('/',privilege.isAuthenticated, wrapper(productController.getProducts))
router.get('/:id', privilege.isAuthenticated, wrapper(productController.getproduct))
router.post('/add',privilege.isAuthenticated, privilege.isStaff,validator.validateAddProduct, utils.handleValidationErrors, wrapper(productController.addProductId))
router.put('/edit/:id', privilege.isAuthenticated, privilege.isStaff, validator.validateAddProduct, utils.handleValidationErrors, wrapper(productController.updateProductId))
router.delete('/delete/:id',privilege.isAuthenticated,privilege.isManagerOrAdmin, wrapper(productController.removeProductId))

module.exports = router;
