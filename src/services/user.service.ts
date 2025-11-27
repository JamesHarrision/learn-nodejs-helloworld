import { prisma } from "config/client";
import getConnection from "config/database";

const handleCreateUser = async (
  name: string, 
  email: string, 
  address: string) => {
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        address: address
      }
    });
    return user;
}

const getAllUsers = async () => {
  const users = await prisma.user.findMany({

  });
  return users;
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

const updateUserById = async (id: String,
   fullName: String, email: String, address: String, 
) => {
  const connection = await getConnection();
  try {
    const sql = 'UPDATE `users` SET `name` = ?, `email` = ?, `address` = ? WHERE `id` = ? LIMIT 1';
    const values = [fullName, email, address, id];

    const [result, fields] = await connection.execute(sql, values);
    return result;
  } catch (err) {
    console.log(err);
  }
}


export { handleCreateUser, getAllUsers, handleDeleteUser, getUserById, updateUserById}