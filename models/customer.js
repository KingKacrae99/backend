const mongoose = require('mongoose')
const { schema } = mongoose

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true
  },
  phone: {
    type: String,
  },
  address: String,
  creditTerms: {
    type: String,
    default: 'Immediate Payment'
  },
  notes: String
},
    { timestamps: true }
);

const customer = mongoose.model('Customer', customerSchema);

module.exports = customer;
