export function createTableSQL(tableName, fields) {
    const columns = fields.map(field => {
        if (field.toLowerCase() === 'status' || field.toLowerCase() === 'priority' || field.toLowerCase()==="status") {
            return `${field} INT`;
        }
        return `${field} VARCHAR(255)`; 
    }).join(', ');

    const createTableSQL = `CREATE TABLE ${tableName} (${columns});`;
    return createTableSQL;
}


  export const insertTicket = (ticket) => {
    
    const fields = Object.keys(ticket);
    const values = Object.values(ticket);
  

    const fieldsString = fields.join(', ');
    
   
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

  export const updatePushedToFreshdesk = async (email,conn) => {
    const sql = `UPDATE Tickets SET pushed_to_freshdesk = 1 WHERE Email = ?`;
    await conn.query(sql, [email]);
  };