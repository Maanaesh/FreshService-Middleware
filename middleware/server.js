import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import ticketRoutes from './routes/ticketRoutes.js';
import freshserviceRoutes from './routes/freshserviceRoutes.js'
import handler from './controller/handler.js';
import cors from 'cors';
dotenv.config();

const port = process.env.PORT || 5000;
const FRESHDESK_KEY = process.env.FRESHDESK_API;
const FRESHDESK_URL = process.env.FRESHDESK_URL;

const app = express();
app.use(express.json());
app.use(cors())

// Routes
app.use('/api/tickets', ticketRoutes);
app.use('/api/freshservice',freshserviceRoutes);      

app.listen(port, async () => {
      await connectDB();
    
      console.log('Database connected successfully');
      console.log(`Middleware listening on port ${port}`);
      // console.log(FRESHDESK_KEY,FRESHDESK_URL);
      handler(FRESHDESK_KEY,FRESHDESK_URL);
    
});