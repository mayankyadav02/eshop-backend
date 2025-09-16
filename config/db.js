import mongoose from "mongoose";
import dotenv from "dotenv";
import { previewProductsFromCSV } from "../models/loadProducts.js";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    
    previewProductsFromCSV();

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
