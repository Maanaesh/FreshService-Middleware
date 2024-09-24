export function createTableSQL(tableName, fields) {
    const columns = fields.map(field => `${field} VARCHAR(255)`).join(', ');
    const createTableSQL = `CREATE TABLE ${tableName} (${columns});`;
    return createTableSQL;
  }

  export const insertTicket = (ticket) => {
    // Get the keys and values from the ticket object
    const fields = Object.keys(ticket);
    const values = Object.values(ticket);
  
    // Create a string of fields joined by commas
    const fieldsString = fields.join(', ');
    
    // Create a string of values wrapped in quotes for SQL
    const valuesString = values.map(value => {
      // Convert boolean values (0 or 1) to strings if necessary
      return typeof value === 'string' ? `'${value.replace(/'/g, "''")}'` : value;
    }).join(', ');
  
    // Construct the final INSERT SQL statement
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