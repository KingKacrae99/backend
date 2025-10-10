const router = require('express').Router();
const categoryController = require('../controllers/category')
const wrapper = require('../middleware/wrapper')

router.get('/', wrapper(categoryController.getCategories))
router.get('/:id', wrapper(categoryController.getcategoryById))
router.post('/add', wrapper(categoryController.addCategory))
router.put('/update/:id', wrapper(categoryController.updateCategoryId))
router.delete('/delete/:id', wrapper(categoryController.removeCategoryId))

module.exports = router;