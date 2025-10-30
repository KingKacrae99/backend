// app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('./config/passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const router = require('./routes/');
const errorMiddleware = require('./middleware/error');

require('dotenv').config();

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
    collectionName: 'sessions',
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  }
}));

app
  .use(cors({
    origin: 'http://127.0.0.1:5500/',
    credentials: true
  }))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());
app.use('/', router);

app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry we appear to have lost the page!' });
});

app.use(errorMiddleware);

module.exports = app;
