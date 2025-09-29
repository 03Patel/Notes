import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); // load .env at the very top

// Get Mongo URI from environment
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MongoDB URI not found in .env. Please set MONGO_URI.');
  process.exit(1); // Stop server if URI is missing
}

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Stop server on connection failure
  }
};
