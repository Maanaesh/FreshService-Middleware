// mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.1
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.1");
    console.log(`mongo db connected Succesfully `);
  } catch (error) {
    console.log(`error: ${error.message}`);
    process.exit(1); //exit with failure
  }
};
