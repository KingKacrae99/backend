// __tests__/product.test.js
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const db = require('../models');
const Product = db.products;

describe('Product API', () => {
  beforeEach(async () => {
    await Product.deleteMany();
  });

  it('should return all products', async () => {
    const fakeProducts = [
      {
        name: "Wireless Mouse",
        sku: "MSE100",
        description: "Ergonomic wireless mouse with USB receiver",
        category: new mongoose.Types.ObjectId(),
        costPrice: 15.99,
        sellPrice: 29.99,
        quantity: 50,
        reorderLevel: 10,
        supplierId: new mongoose.Types.ObjectId(),
        unit: "Pieces"
      },
      {
        name: "Gaming Keyboard",
        sku: "KEY200",
        description: "RGB mechanical gaming keyboard",
        category: new mongoose.Types.ObjectId(),
        costPrice: 35.50,
        sellPrice: 59.99,
        quantity: 30,
        reorderLevel: 5,
        supplierId: new mongoose.Types.ObjectId(),
        unit: "Box"
      }
    ];

    await Product.create(fakeProducts);

    const res = await request(app).get("/products");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.result)).toBe(true);
    expect(res.body.result.length).toBe(2);

    // Partial matches (ignore _id, timestamps and ObjectId differences)
    expect(res.body.result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Wireless Mouse", sku: "MSE100" }),
        expect.objectContaining({ name: "Gaming Keyboard", sku: "KEY200" })
      ])
    );
  });
});
