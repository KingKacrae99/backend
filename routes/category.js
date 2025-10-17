const router = require('express').Router();
const categoryController = require('../controllers/category')
const wrapper = require('../middleware/wrapper')
const { validateAddCategory, validateUpdateCategory } = require('../middleware/categoryValidation');
const { utils } = require("../utils")
const privilege = require("../middleware/auth")

router.get('/',wrapper(categoryController.getCategories))
router.get('/:id', wrapper(categoryController.getcategoryById))
router.post('/add', privilege.isAuthenticated, privilege.isManagerOrAdmin, validateAddCategory, utils.handleValidationErrors, wrapper(categoryController.addCategory))
router.put('/update/:id', privilege.isAuthenticated, privilege.isManagerOrAdmin,validateUpdateCategory, utils.handleValidationErrors, wrapper(categoryController.updateCategoryId))
router.delete('/delete/:id', privilege.isAuthenticated, privilege.isManagerOrAdmin, wrapper(categoryController.removeCategoryId))

module.exports = router;