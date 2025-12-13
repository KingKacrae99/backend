const passport = require('passport')
const auth = {}

auth.home = async (req, res, next) => {
    try {
        if (req.user) {
            return res.send(`Welcome ${req.user.fullName}`);
        }
        res.send("Logged Out")
    } catch (error) {
        next(error)
    }
}

auth.logout = async (req, res, next) => { 
    try {
        req.logout((err) => {
            if (err) {
               return next(err)
            }
            req.session.destroy((err) => {
                if (err) {
                   return next(err)
                }
                res.clearCookie('connect.sid', {
                    path: '/',
                    secure: process.env.NODE_ENV === 'production',
                    httpOnly: true,
                    sameSite: 'lax'
                });
                res.status(200).json({
                    status: "success",
                    message:"Logout Sucessful"
                })
            })
        })
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

auth.checkAuthStatus = async (req, res, next) => {
    try {
        if (req.user.is_authenticated) {
            return res.status(200).json({
                status: 200,
                loggedIn: true,
                message: "user successfully loggedIn",
                result: resq.user
            });
        }
        return res.status(400).json({
            status: 400,
            loggedIn: true,
            message: "Pls login"
        })
    } catch (error) {
        next(error)
    }
}


module.exports = auth;
 