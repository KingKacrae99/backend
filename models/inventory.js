const mongoose = require('mongoose')
const { schema } = mongoose

const inventoryAuditSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  action: {
    type: String,
    enum: ['Add Stock', 'Remove Stock', 'Sale', 'Adjustment'],
    required: true
  },
  quantityChanged: {
    type: Number,
    required: true
  },
  note: String
},
    { timestamps: true }
);

module.exports = mongoose.model('InventoryAudit', inventoryAuditSchema);
