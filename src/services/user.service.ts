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
  const user = prisma.user.findUnique({
    where: {
      id: +id
    }
  });
  return user;
}

const updateUserById = async (id: string,
   fullName: string, email: string, address: string, 
) => {
  const updatedUser = await prisma.user.update({
    where: {
      id: +id
    },
    data: {
      name: fullName,
      email: email,
      address: address,
    }
  });
  return updatedUser;
}


export { handleCreateUser, getAllUsers, handleDeleteUser, getUserById, updateUserById}