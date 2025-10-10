const router = require('express').Router()
const authRoute = require('./auth')
const userRoute = require('./user')
const productRoute = require('./product')
const categoryRoute = require('./category') 

router.use('/auth', authRoute)
router.use('/user', userRoute)
router.use('/products', productRoute)
router.use('/category',categoryRoute)

module.exports= router


