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

    ticket.pushed_to_freshdesk = 0; // Set default value
    console.log(ticket);

    try {
        // Check if the columns already exist
        const emailExists = await checkColumnExists(conn, 'Tickets', 'Email');
        const pushedExists = await checkColumnExists(conn, 'Tickets', 'pushed_to_freshdesk');
        if (!emailExists) {
            await conn.query("ALTER TABLE Tickets ADD Email VARCHAR(255);");
        }

        if (!pushedExists) {
            await conn.query("ALTER TABLE Tickets ADD pushed_to_freshdesk BIT DEFAULT 0;");
        }


        const sql = insertTicket(ticket);
        await conn.query(sql);

        res.status(200).json({ message: 'Ticket stored successfully' });
    } catch (error) {
        console.error('Error handling ticket creation:', error);
        res.status(500).json({ message: 'Failed to save ticket' });
    }
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

      const tableName = "Tickets";
        
      const tableExistsQuery = `SHOW TABLES LIKE '${tableName}'`;
      const tableExistsResult = await conn.query(tableExistsQuery);
        
      if (tableExistsResult.length > 0) {
            const newTableName = `${tableName}_backup_${Date.now()}`;
            await conn.query(`CREATE TABLE ${newTableName} LIKE ${tableName}`);
            console.log(`Backup of table ${tableName} created as ${newTableName}`);
            
            await conn.query(`DROP TABLE ${tableName}`);
            console.log(`Dropped table ${tableName}`);
        }
      const sql = createTableSQL(tableName, FD_fields);
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
    handler(FRESHDESK_KEY,FRESHDESK_URL,conn);
  });
};

// Initialize the application
initializeApp().catch((err) => {
  console.error('Failed to initialize application:', err);
});
