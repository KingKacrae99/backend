const router = require('express').Router();
const userController = require('../controllers/user')
const wrapper = require('../middleware/wrapper')
const { UserRules } = require("../middleware/userValidation")
const {utils} =require("../utils/index")

router.get('/', wrapper(userController.getUsers));
router.put('/:id', UserRules, utils.handleValidationErrors, wrapper(userController.updateUsers))
router.get('/:id', wrapper(userController.getUser))
router.delete('/:id', wrapper(userController.removeUser))

module.exports = router