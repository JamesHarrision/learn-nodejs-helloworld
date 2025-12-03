import { prisma } from "config/client";
import { ACCOUNT_TYPE } from "config/constant";
import getConnection from "config/database";

import bcrypt from 'bcrypt' 
const saltRounds = 10;

const hashPassword = async (plainText: string) => {
  return await bcrypt.hash('123456', saltRounds);
}

const handleCreateUser = async (
  fullName: string, 
  email: string, 
  address: string,
  phone: string,
  avatar: string,
  role: string
    ) => {
    const defaultPassword = await hashPassword("123456");
    const user = await prisma.user.create({
      data: {
        fullName: fullName,
        username: email,
        address: address,
        password: defaultPassword,
        accountType: ACCOUNT_TYPE.SYSTEM,
        avatar: avatar,
        phone: phone,
        roleId: +role,
      }
    });
    return user;
}

const getAllUsers = async () => {
  const users = await prisma.user.findMany({

  });
  return users;
}

const getAllRoles = async () => {
  const roles = await prisma.role.findMany({

  });
  return roles;
}

const handleDeleteUser = async (id: string) => {
  const deletedUser = await prisma.user.delete({
    where: {
      id: +id,
    }
  });
  return deletedUser;
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
   name: string, email: string, address: string, 
) => {
  const updatedUser = await prisma.user.update({
    where: {
      id: +id
    },
    data: {
        fullName: name,
        username: email,
        address: address,
        password: "",
        accountType: ""
    }
  });
  return updatedUser;
}


export { handleCreateUser, getAllUsers, handleDeleteUser, getUserById, updateUserById, getAllRoles, hashPassword
}