const mongoose = require('mongoose')
const { schema } = mongoose

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true
  },
  phone: String,
  address: String,
  productsSupplied: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
  ]
},
    { timestamps: true }
);

const supplier = mongoose.model('Supplier', supplierSchema);

module.exports = supplier;
