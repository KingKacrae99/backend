const mongodb = require('../models/index')
const mongoose = mongodb.mongoose
const url = mongodb.url

async function main(){
    await mongoose.connect(url);
    console.log("Database successfully connected 📶")
}

module.exports = main;