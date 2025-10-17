const router = require('express').Router()
const authRoute = require('./auth')
const userRoute = require('./user')
const productRoute = require('./product')
const categoryRoute = require('./category')
const orderRoute = require('./order')
const supplierRoute = require('./supplier')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger/swagger.json');
const homeController = require('../controllers/auth')
const invRoute = require("./inventory-audit")

router.use('/api', swaggerUi.serve);
router.get('/api', swaggerUi.setup(swaggerDocument));
router.get('', homeController.home)
router.use('/auth', authRoute)
router.use('/user', userRoute)
router.use('/products', productRoute)
router.use('/category', categoryRoute)
router.use('/orders',orderRoute)
router.use('/suppliers', supplierRoute)
router.use('/inv',invRoute)

module.exports = router;


