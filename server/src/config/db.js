const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    // If no MONGO_URI set or using default, spin up in-memory MongoDB
    if (!uri || uri === 'mongodb://localhost:27017/career_recommender') {
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const memUri = mongod.getUri();
        await mongoose.connect(memUri);
        console.log('⚡ Using in-memory MongoDB (no install needed!)');
        console.log('⚠️  Data will be lost on server restart. Set MONGO_URI in .env for persistence.');
        return;
      } catch (err) {
        console.error('Could not start in-memory MongoDB:', err.message);
        console.error('Please install MongoDB locally or set MONGO_URI to a MongoDB Atlas connection string.');
        process.exit(1);
      }
    }

    // Use provided URI (Atlas or local)
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
