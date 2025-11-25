import getConnection from "config/database";

const handleCreateUser = async (
  fullName: String, 
  email: String, 
  address: String) => {
    //Insert into database
  const connection = await getConnection();
  try {
    // execute will internally call prepare and query
    const sql = 'INSERT INTO `users`(`name`, `email`, `address`) VALUES (?, ?, ?)';
    const values = [fullName, email, address];
    const [result, fields] = await connection.execute(sql, values);
    return result;
  } catch (err) {
    console.log(err);
    return [];
  }
}

const getAllUsers = async () => {
  const connection = await getConnection();
  try {
    const [results, fields] = await connection.query(
      'SELECT * FROM users'
    );
    return results;
  } catch (err) {
    console.log(err);
    return [];
  }
}

const handleDeleteUser = async (id: String) => {
  const connection = await getConnection();
  try {
    const sql = 'DELETE FROM `users` WHERE `id` = ? LIMIT 1';
    const values = [id];
    const [result, fields] = await connection.execute(sql, values);
    return result;
  } catch (err) {
    console.log(err);
    return [];
  }
}

const getUserById = async (id: String) => {
  const connection = await getConnection();
  try {
    const sql = 'SELECT * FROM `users` WHERE `id` = ?';
    const values = [id];

    const [result, fields] = await connection.execute(sql, values);
    return result[0];
  } catch (err) {
    console.log(err);
    return [];
  }
}


export { handleCreateUser, getAllUsers, handleDeleteUser, getUserById}