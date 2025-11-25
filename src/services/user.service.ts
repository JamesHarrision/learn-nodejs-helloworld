import getConection from "../config/database";

const handleCreateUser = (
  fullName: String, 
  email: String, 
  address: String) => {
      //Insert into database

      //Return result
      console.log("Insert a new user");
}

const getAllUsers = async () => {
  const connection = await getConection();
  
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

export { handleCreateUser, getAllUsers }