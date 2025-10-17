const router = require('express').Router();
const passport = require('../config/passport');
const auth = require('../controllers/auth');
const authController = require('../controllers/auth');
const privilege = require("../middleware/auth")

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/',
    session: true
}), authController.callback);
router.get('/logout',privilege.isAuthenticated, auth.logout)

module.exports = router;
