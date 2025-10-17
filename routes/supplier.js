const router = require("express").Router();
const supplierController = require("../controllers/supplier")
const wrapper = require("../middleware/wrapper")
const privilege = require("../middleware/auth")
const {
    validateAddSupplier,
    validateUpdateSupplier,
    validationHandler,
} = require('../middleware/supplierValidation');

router.post('/add', validateAddSupplier, validationHandler, wrapper(supplierController.addSupplier))
router.put('/update/:id', validateUpdateSupplier, validationHandler, wrapper(supplierController.updateSupplier))
router.get('/:id', wrapper(supplierController.getSupplier))
router.get('', wrapper(supplierController.getAllSupplier))

module.exports = router;
