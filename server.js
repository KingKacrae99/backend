require('dotenv').config()
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('./config/passport')
const session = require('express-session')
const main = require('./database/index')
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const router = require('./routes/')
const errorMiddleware = require('./middleware/error');
const app = express()


/**************************************************
 * SSSION MIDDLEWARE SETUP
**************************************************/
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL,
        collectionName: 'sessions',
    }),
    cookie: {
        secure: false,
        httpOnly: true
    }
}));

/**************************************************
 *  Global Middlewares
**************************************************/
app
    .use(cors())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(cookieParser())

/*****************************************
 * Passport Middleware
*****************************************/
app.use(passport.initialize());
app.use(passport.session());

/***************************************
 *  Route
****************************************/
app.use('/', router)

/******************************************************************
 * App and Error Middleware 
*******************************************************************/
app.use(async (req, res, next) => {
   next({status:404, message:'Sorry we appear to have lost the page!'}) 
});

// error handler
app.use(errorMiddleware)
  
const port = process.env.PORT

/***********************************
 * Mongo connection function
************************************/
main().catch(err => console.log(err));

/*******************************************************
 *  App listener / Tracker
********************************************************/
app.listen(port, () => {
    console.log("Web service server running on port:",port)
})