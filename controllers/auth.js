const passport = require('passport')
const auth = {}

auth.login = async (req,res,next) => {
    res.redirect('/google')
}

auth.logout = async (req, res, next) => { 
    try {
        req.logout()
        res.redirect('/')
    } catch (err) {
        next(err)
    }
}

auth.callback = async (req, res, next) => {
    try {
        if (req.user) {
           req.session.user = req.user;
            return res.redirect('/');
        }
        return next()
     } catch (err) {
        next(err)
    }
}

auth.logout = async (req,res,next) => {
    try {
        req.session.destroy()
        return res.redirect('/')
    } catch (err) {
        next(err);
    }
}

module.exports = auth;
 