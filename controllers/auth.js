const passport = require('passport')
const auth = {}

auth.home = async (req,res,next) => {
    try {
        if (req.user) {
            return res.send(`Welcome ${req.user.fullName}`);
        }
        res.send("Logged Out")
    } catch (error) {
        
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
            return res.redirect('/api');
        }
        return next()
     } catch (err) {
        next(err)
    }
}



module.exports = auth;
 