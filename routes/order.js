const router = require('express').Router();
const orderController = require('../controllers/order')
const wrapper = require('../middleware/wrapper')
const { validateCreateOrder, validateUpdateOrder } = require('../middleware/orderValidation');
const { utils } = require('../utils');
const privilege = require("../middleware/auth")


router.get('/',/*privilege.isAuthenticated,privilege.isStaff,*/ wrapper(orderController.getOrders))
router.get('/:id',/*privilege.isAuthenticated, privilege.isStaff,*/ wrapper(orderController.getOrderById))
router.put('/update/:id',/*privilege.isAuthenticated, privilege.isStaff,*/validateUpdateOrder, utils.handleValidationErrors, wrapper(orderController.updateOrder))
router.post('/add', /*privilege.isAuthenticated ,privilege.isStaff,*/ validateCreateOrder, utils.handleValidationErrors, wrapper(orderController.createOrder))
router.delete('/delete/:id',/* privilege.isAuthenticated, privilege.isAdmin,*/ wrapper(orderController.removeOrderById))

module.exports = router;