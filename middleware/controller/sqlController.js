import { getConnection } from "../config/db.js";

export function createTableSQL(tableName, fields) {
  // Define the primary key column as `key` with AUTO_INCREMENT
  const primaryKeyColumn = `id INT AUTO_INCREMENT PRIMARY KEY`;

  // Map other fields to their respective SQL definitions
  const columns = fields.map(field => {
      if (field.toLowerCase() === 'status' || field.toLowerCase() === 'priority') {
          return `${field} INT`;
      }
      return `${field} VARCHAR(255)`; 
  }).join(', ');

  // Combine the primary key and other columns
  const createTableSQL = `CREATE TABLE ${tableName} (${primaryKeyColumn}, ${columns});`;
  return createTableSQL;
}


  export const insertTicket = async (ticket) => {
    
    const conn = await getConnection();
    const [columns] = await conn.query(`SHOW COLUMNS FROM Tickets`);
    const tableFields = columns
  .filter(col => col.Field !== 'id')
  .map(col => col.Field);
    const values = Object.values(ticket);
 

    const fieldsString = tableFields.join(', ');
    
   
    const valuesString = values.map(value => {
      return typeof value === 'string' ? `'${value.replace(/'/g, "''")}'` : value;
    }).join(', ');
  
    return `INSERT INTO Tickets (${fieldsString}) VALUES (${valuesString});`;
  };

export const checkColumnExists = async (conn, tableName, columnName) => {
    const sql = `
      SELECT COUNT(*) as count 
      FROM information_schema.columns 
      WHERE table_name = ? AND column_name = ?
    `;
    const [rows] = await conn.query(sql, [tableName, columnName]);
    return rows[0].count > 0;
  };

  export const updatePushedToFreshdesk = async (id,conn,val) => {
    const sql = `UPDATE Tickets SET pushed_to_freshdesk = ${val} WHERE id = ?`;
    await conn.query(sql, [id]);
  };