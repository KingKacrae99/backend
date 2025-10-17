const router = require('express').Router();
const userController = require('../controllers/user')
const wrapper = require('../middleware/wrapper')
const { UserRules } = require("../middleware/userValidation")
const { utils } = require("../utils/index")
const privilege = require("../middleware/auth")

router.get('/', privilege.isAuthenticated, privilege.isAdmin, wrapper(userController.getUsers));
router.put('/:id',privilege.isAuthenticated ,privilege.isAdmin, UserRules, utils.handleValidationErrors, wrapper(userController.updateUsers))
router.get('/:id', privilege.isAuthenticated, wrapper(userController.getUser))
router.delete('/:id',privilege.isAuthenticated, privilege.isAdmin,wrapper(userController.removeUser))

module.exports = router