const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Business Mgt API',
    description: 'Inventory and Billing Web Services (Backend)',
  },
  host: 'localhost:3000',
  definitions: {
    User: {
      googleId: '1234567890abcdef',
      fullName: 'John Doe',
      email: 'johndoe@example.com',
      picture: 'https://example.com/avatar.jpg',
      local: 'en-US',
      locale: 'US',
      role: 'Client', // enum: ['Admin', 'Manager', 'Staff', 'Client']
      joinedAt: '2025-10-16T00:00:00.000Z',
    },

    Supplier: {
      name: 'MedTech Supplies Ltd.',
      email: 'contact@medtech.com',
      phone: '+2348012345678',
      address: '12 Main Street, Lagos, Nigeria',
      productsSupplied: ['60d5f4832b8b4f1e9c1a1234'],
      createdAt: '2025-10-16T00:00:00.000Z',
      updatedAt: '2025-10-16T00:00:00.000Z',
    },

    Product: {
      name: 'Paracetamol',
      sku: 'PRC-001',
      description: 'Pain relief tablet',
      category: '60d5f4832b8b4f1e9c1a5678',
      costPrice: 100,
      sellPrice: 150,
      quantity: 200,
      reorderLevel: 10,
      supplierId: '60d5f4832b8b4f1e9c1a1234',
      unit: 'Packs', // enum: ['Pieces', 'Packs', 'Dozen', 'Box']
      createdAt: '2025-10-16T00:00:00.000Z',
      updatedAt: '2025-10-16T00:00:00.000Z',
    },

    OrderItem: {
      productId: '60d5f4832b8b4f1e9c1a5678',
      name: 'Paracetamol',
      quantity: 5,
      price: 150,
      subtotal: 750,
    },

    Order: {
      items: [
        { $ref: '#/definitions/OrderItem' },
      ],
      total: 750,
      tax: 0,
      discount: 0,
      status: 'Pending', // enum: ['Pending', 'Paid']
      createdAt: '2025-10-16T00:00:00.000Z',
      updatedAt: '2025-10-16T00:00:00.000Z',
    },

    Category: {
      name: 'Pharmaceuticals',
    },
  },
};

const outputFile = '../swagger/swagger.json';
const routes = ['./routes/index.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only
the root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
