require('dotenv').config();
const mongoose = require('mongoose')
const users = require('./users')
const products = require('./products')
const orders = require('./order')
const customers = require('./customer')
const inventory = require('./inventory')
const suppliers = require('./supplier')
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = process.env.MONGODB_URL;
db.users = users;
db.products = products;
db.orders = orders;
db.customer = customers;
db.inventory = inventory;
db.supplier = suppliers;

module.exports = db;
