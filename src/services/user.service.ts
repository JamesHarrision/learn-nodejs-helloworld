import { prisma } from "config/client";
import { ACCOUNT_TYPE } from "config/constant";
import getConnection from "config/database";

import bcrypt from 'bcrypt' 
import { hash } from "crypto";
const saltRounds = 10;

const hashPassword = async (plainText: string) => {
  return await bcrypt.hash(plainText, saltRounds);
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

const getAllUsers = async (page: number) => {
  const pageSize = 2;
  const skip = (page - 1) * pageSize;

  const users = await prisma.user.findMany({
    skip: skip,
    take: pageSize,
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

const updateUserById = async (
   id: string,
   fullName: string, 
   phone: string,
   role: string,
   address: string,
   avatar: string 
) => {
  const updatedUser = await prisma.user.update({
    where: {
      id: +id
    },
    data: {
        fullName: fullName,
        address: address,
        phone: phone,
        roleId: +role,
        ...(avatar !== undefined && {avatar: avatar})
    }
  });
  return updatedUser;
}

const comparePassword = async (plainText: string, hashPassword: string) => {
  return await bcrypt.compare(plainText, hashPassword);
}

export { handleCreateUser, getAllUsers, handleDeleteUser, getUserById, updateUserById, getAllRoles, hashPassword, comparePassword
}