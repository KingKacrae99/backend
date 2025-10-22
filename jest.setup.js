// jest.setup.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const server = require('./server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  // Clean up data between tests
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongoServer) await mongoServer.stop();
  
  server.close()
});

