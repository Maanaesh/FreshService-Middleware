import mysql from 'mysql2/promise';  // Use the promise-based API

let pool;

export const connectDB = async () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'middleware',
      waitForConnections: true,
      connectionLimit: 10, // Adjust the pool size depending on your requirements
      queueLimit: 0,
    });

    console.log('MySQL pool created');
  }
  return pool;
};
export const getConnection = async () => {
  const conn = await pool.getConnection();
  return conn;
};