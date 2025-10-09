const router = require('express').Router();
const userController = require('../controllers/user')
const wrapper = require('../middleware/wrapper')

router.get('/', wrapper(userController.getUsers));
router.put('/:id', wrapper(userController.updateUsers))
router.get('/:id', wrapper(userController.getUser))
router.delete('/:id', wrapper(userController.removeUser))

module.exports = router