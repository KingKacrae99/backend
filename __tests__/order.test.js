// __tests__/order.test.js
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const db = require('../models');
const Order = db.orders;

describe('Order API', () => {
  beforeEach(async () => {
    await Order.deleteMany();
  });

  it('should create and return orders', async () => {
    const fakeOrders = [
      {
        items: [
          {
            productId: new mongoose.Types.ObjectId(),
            name: "Wireless Mouse",
            quantity: 2,
            price: 29.99,
            subtotal: 59.98
          },
          {
            productId: new mongoose.Types.ObjectId(),
            name: "Gaming Keyboard",
            quantity: 1,
            price: 59.99,
            subtotal: 59.99
          }
        ],
        total: 119.97,
        tax: 5.99,
        discount: 0,
        status: "Paid"
      },
      {
        items: [
          {
            productId: new mongoose.Types.ObjectId(),
            name: "Laptop Cooling Pad",
            quantity: 3,
            price: 19.99,
            subtotal: 59.97
          }
        ],
        total: 59.97,
        tax: 2.99,
        discount: 5.00,
        status: "Pending"
      }
    ];

    await Order.create(fakeOrders);

    const res = await request(app).get("/orders");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.result)).toBe(true);
    expect(res.body.result.length).toBe(2);

    // assert partial contents and totals that match created data
    expect(res.body.result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ total: 119.97, status: "Paid" }),
        expect.objectContaining({ total: 59.97, status: "Pending" })
      ])
    );
  });
});
