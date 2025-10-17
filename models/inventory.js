const mongoose = require('mongoose')


const inventoryAuditSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
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
  isRead: {
    type: Boolean,
    default: false
  },
  note: String
},
    { timestamps: true }
);

const InventoryAudit = mongoose.model('InventoryAudit', inventoryAuditSchema)

module.exports = InventoryAudit;
