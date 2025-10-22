const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app')
const db = require('../models');
const supplier = db.supplier

describe('Should return product supplier', () => {
    beforeEach(async () => {
        await supplier.deleteMany()
    })

    it("Get's all supplier", async () => {

        const fakeSuppliers = [
        {
            name: 'Global Supply Co.',
            email: 'info@globalsupplyco.com',
            phone: '555-123-4567',
            address: '123 Main Street, Anytown USA',
            productsSupplied: [
                new mongoose.Types.ObjectId(), 
                new mongoose.Types.ObjectId(), 
            ],
        },
        {
            name: 'Tech Innovations Inc.',
            email: 'contact@techinnovations.net',
            phone: '555-987-6543',
            address: '456 Tech Park, Innovate City',
            productsSupplied: [], 
        },
        {
            name: 'Eco-Friendly Goods',
            email: 'sales@ecogoods.co',
            phone: '555-555-5555',
            address: '789 Green Blvd, Eco-Village',
            productsSupplied: [
                new mongoose.Types.ObjectId(),
            ],
        },
        ];

        await supplier.create(fakeSuppliers);

        const res = await request(app).get('/suppliers');

        expect(res.status).toBe(200);
        expect(res.body.result.length).toBe(3);
        expect(res.body.result).toEqual(expect.arrayContaining([
            expect.objectContaining({ name: "Global Supply Co."}),
            expect.objectContaining({ name: "Tech Innovations Inc." }),
            expect.objectContaining({ name: "Eco-Friendly Goods" })
        ]));
    });
});