import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db.js'; // Ensure this imports correctly
import Ticket from './ticket.js';
import handler from './handler.js';
import { checkColumnExists, createTableSQL, insertTicket } from './sqlFunctions.js';

dotenv.config();  // Load environment variables from .env file

const app = express();
app.use(express.json());
const port = 3000;
const FRESHDESK_KEY = 'GNqXIlHkv2vmPWhxg6zE';
const FRESHDESK_URL = 'https://effy-opinyin.freshdesk.com';

const initializeApp = async () => {
  const conn = await connectDB();  

  app.post("/api/createTickets", async (req, res) => {
    const ticket = req.body.FS_fields;
  
    ticket.pushed_to_freshdesk = 0;
    console.log(ticket);
  
    try {
      const emailExists = await checkColumnExists(conn, 'Tickets', 'Email');
      const pushedExists = await checkColumnExists(conn, 'Tickets', 'pushed_to_freshdesk');
  
      let sql = '';
  
      if (!emailExists) {
        sql += "ALTER TABLE Tickets ADD Email VARCHAR(255); ";
      }
      
      if (!pushedExists) {
        sql += "ALTER TABLE Tickets ADD pushed_to_freshdesk BIT DEFAULT 0; ";
      }
  
      if (sql) {
        await conn.query(sql);
      }
  
      sql = insertTicket(ticket); 
      await conn.query(sql);
  
      res.status(200).json({ message: 'Ticket stored successfully' });
    } catch (error) {
      console.error('Error handling ticket creation:', error);
      res.status(500).json({ message: 'Failed to save ticket' });
    }
  });
  

  app.get("/", async (req, res) => {
    return res.status(200).json({ message: "hello!" });
  });

  app.post("/api/storeFieldMap", async (req, res) => {
    try {
      const map = req.body.map;
      const FD_fields = req.body.FD_fields;

      if (!map || !FD_fields) {
        return res.status(400).json({ message: 'Invalid data. map or FD_fields missing.' });
      }

      console.log("Map received:", map);
      console.log("FD_fields received:", FD_fields);

    
      const sql = createTableSQL("Tickets", FD_fields);
      console.log(sql);

      await conn.query(sql);

      res.status(200).json({ message: 'Stored successfully' });
    } catch (error) {
      console.error('Error handling request:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.listen(port, () => {
    console.log(`Middleware listening on port ${port}`);
    // Optionally handle FRESHDESK_KEY and FRESHDESK_URL
  });
};

// Initialize the application
initializeApp().catch((err) => {
  console.error('Failed to initialize application:', err);
});
