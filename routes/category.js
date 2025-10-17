const router = require('express').Router();
const categoryController = require('../controllers/category')
const wrapper = require('../middleware/wrapper')
const { validateAddCategory, validateUpdateCategory } = require('../middleware/categoryValidation');
const {utils} = require("../utils")

router.get('/', wrapper(categoryController.getCategories))
router.get('/:id', wrapper(categoryController.getcategoryById))
router.post('/add', validateAddCategory, utils.handleValidationErrors, wrapper(categoryController.addCategory))
router.put('/update/:id', validateUpdateCategory, utils.handleValidationErrors, wrapper(categoryController.updateCategoryId))
router.delete('/delete/:id', wrapper(categoryController.removeCategoryId))

module.exports = router;