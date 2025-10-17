const router = require("express").Router();
const supplierController = require("../controllers/supplier")
const wrapper = require("../middleware/wrapper")
const privilege = require("../middleware/auth")
const {
    validateAddSupplier,
    validateUpdateSupplier,
    validationHandler,
} = require('../middleware/supplierValidation');

router.post('/add',/*privilege.isAuthenticated,privilege.isManagerOrAdmin,*/ validateAddSupplier, validationHandler, wrapper(supplierController.addSupplier))
router.put('/update/:id',/*privilege.isAuthenticated,privilege.isAdmin,*/ validateUpdateSupplier, validationHandler, wrapper(supplierController.updateSupplier))
router.get('/:id',/*privilege.isAuthenticated, privilege.isManagerOrAdmin,*/ wrapper(supplierController.getSupplier))
router.get('',/*privilege.isAuthenticated,privilege.isManagerOrAdmin,*/ wrapper(supplierController.getAllSupplier))
router.delete('/delete/:id',/*privilege.isAuthenticated,privilege.isManagerOrAdmin,*/wrapper(supplierController.deleteSupplier))

module.exports = router;
