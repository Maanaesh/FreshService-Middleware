import { getConnection } from '../config/db.js';
import { checkColumnExists, createTableSQL, insertTicket } from './sqlController.js';


export const createTicket= async (req, res) => {
    const ticket = req.body.FS_fields;
    ticket.pushed_to_freshdesk = 0;
    console.log(ticket);

    try {
        const conn = await getConnection();
        // Check if the columns already exist
        const emailExists = await checkColumnExists(conn, 'Tickets', 'email');
        const pushedExists = await checkColumnExists(conn, 'Tickets', 'pushed_to_freshdesk');
        if (!emailExists) {
            await conn.query("ALTER TABLE Tickets ADD email VARCHAR(255);");
        }

        if (!pushedExists) {
            await conn.query("ALTER TABLE Tickets ADD pushed_to_freshdesk BIT DEFAULT 0;");
        }


        const sql = await insertTicket(ticket);
        await conn.query(sql);

        res.status(200).json({ message: 'Ticket stored successfully' });
    } catch (error) {
        console.error('Error handling ticket creation:', error);
        res.status(500).json({ message: 'Failed to save ticket' });
    }
}

export const hello= async(req, res) =>{
    res.status(200).json({message:"hello"});
}

export const CreateTable = async (req, res) => {
    try {
        const conn = await getConnection();
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
  }