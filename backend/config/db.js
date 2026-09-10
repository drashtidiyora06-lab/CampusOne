import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';

dotenv.config();

let mongoMemoryServer = null;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusone';
    
    // Attempt standard / Atlas connection first
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
      console.log(`[DB] Connected to MongoDB at ${mongoUri.replace(/:([^@]+)@/, ':****@')}`);
      return;
    } catch (err) {
      console.warn(`[DB] Primary MongoDB connection failed (${err.message}). Launching MongoDB Memory Server fallback...`);
    }

    // Fallback to MongoMemoryServer
    mongoMemoryServer = await MongoMemoryServer.create();
    const memUri = mongoMemoryServer.getUri();
    await mongoose.connect(memUri);
    console.log(`[DB] Connected to In-Memory MongoDB Server at ${memUri}`);
  } catch (error) {
    console.error(`[DB] Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
