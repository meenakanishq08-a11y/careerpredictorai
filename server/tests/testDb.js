const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

const connectTestDB = async () => {
  if (process.env.MONGO_URI && process.env.MONGO_URI.startsWith('mongodb+srv://')) {
    await mongoose.connect(process.env.MONGO_URI);
  } else {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
  }
};

const closeTestDB = async () => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
};

module.exports = { connectTestDB, closeTestDB };
