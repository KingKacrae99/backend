const passport = require('passport')
const mongodb = require('../models/index')
const users = mongodb.users;
const GoogleStrategy = require('passport-google-oauth20').Strategy

/**************************************************
 * Google Strategy
***************************************************/
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    scope: ['profile', 'email']
},
    async function verify(accessToken, refreshToken, profile, done) {
        try {
            // checks if user exists
            const existingUser = await users.findOne({ googleId: profile.id })

            // Add user if it doesn't exist
            if (!existingUser) {
                const user = {
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    picture: profile.photos[0].value,
                    local: profile.locale
                }
                const newUser = await users.create(user);
                return done(null, newUser)
            }

            done(null, existingUser)
        } catch (err) {
            done(err,null)
        }
    }
));

/****************************************
 * Save user info into session  
*****************************************/
passport.serializeUser((user, done) => {
    done(null, user.id)
});

/************************************************
 * retrieve user info from session for every req
************************************************/
passport.deserializeUser(async (userId,done) => {
    try {
        const user = await users.findById(userId);
        done(null,user)
    } catch (err) {
        done(err, null);
    }
})

module.exports = passport;
