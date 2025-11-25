// Get the client
import mysql from 'mysql2/promise';

//create the connection to database
const getConection = async () => {
  const connection = await mysql.createConnection({
    port: 3306,
    host: 'localhost',
    password: '123456',
    user: 'root',
    database: 'nodejspro',
  });
  
  return connection;
}

export default getConection;