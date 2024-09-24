// // mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.1
// import mongoose from "mongoose";

// export const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.1");
//     console.log(`mongo db connected Succesfully `);
//   } catch (error) {
//     console.log(`error: ${error.message}`);
//     process.exit(1); //exit with failure
//   }
// };

import mysql from 'mysql2/promise';  // Use the promise-based API

export const connectDB = async () => {
  try {
    const conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "password",
      database: 'middleware',
    });

    console.log("Connected to the database!");

    // Return the connection object if you want to use it later
    return conn;
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;  // Rethrow the error if needed
  }
};
