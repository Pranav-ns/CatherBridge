const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`\n[WARNING] Could not connect to MongoDB Atlas: ${error.message}`);
    console.log('[INFO] Starting temporary local in-memory database instead...\n');

    try {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();

      const conn = await mongoose.connect(mongoUri);
      console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host}`);
      console.log(`Note: Since you are using a local memory database, your login will work but data won't be saved when you stop the server.`);
    } catch (fallbackError) {
      console.error(`Error with in-memory DB: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
