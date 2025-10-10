const router = require('express').Router();
const productController = require('../controllers/product');
const wrapper = require('../middleware/wrapper')

router.get('/', wrapper(productController.getProducts))
router.get('/:id', wrapper(productController.getproduct))
router.post('/add', wrapper(productController.addProductId))
router.put('/edit/:id', wrapper(productController.updateProductId))
router.delete('/delete/:id', wrapper(productController.removeProductId))

module.exports = router;
