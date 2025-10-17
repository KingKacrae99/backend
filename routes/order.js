const router = require('express').Router();
const orderController = require('../controllers/order')
const wrapper = require('../middleware/wrapper')
const { validateCreateOrder, validateUpdateOrder } = require('../middleware/orderValidation');
const { utils } = require('../utils');


router.get('/', wrapper(orderController.getOrders))
router.get('/:id', wrapper(orderController.getOrderById))
router.put('/update/:id',validateUpdateOrder, utils.handleValidationErrors, wrapper(orderController.updateOrder))
router.post('/add',validateCreateOrder, utils.handleValidationErrors, wrapper(orderController.createOrder))
router.delete('/delete/:id', wrapper(orderController.removeOrderById))

module.exports = router;