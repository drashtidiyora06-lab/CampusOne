import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

let mongoMemoryServer = null;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    // 1. Try Remote/Atlas MongoDB
    if (mongoUri) {
      try {
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
        console.log(`[DB] Connected to MongoDB Atlas/Remote successfully.`);
        return;
      } catch (err) {
        console.warn(`[DB] Remote Atlas connection failed: ${err.message}. Trying local Mongo / Memory Server...`);
      }
    }

    // 2. Try Local MongoDB Server
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/campusone', { serverSelectionTimeoutMS: 3000 });
      console.log(`[DB] Connected to Local MongoDB at mongodb://127.0.0.1:27017/campusone`);
      return;
    } catch (err) {
      console.warn(`[DB] Local MongoDB not available: ${err.message}. Initializing MongoMemoryServer...`);
    }

    // 3. MongoMemoryServer with binary fallback options
    mongoMemoryServer = await MongoMemoryServer.create();
    const memUri = mongoMemoryServer.getUri();
    await mongoose.connect(memUri);
    console.log(`[DB] Connected to In-Memory MongoDB Server at ${memUri}`);
  } catch (error) {
    console.error(`[DB] Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

