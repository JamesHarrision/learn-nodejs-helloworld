import { prisma } from "config/client"
import { ACCOUNT_TYPE } from "config/constant";
import { comparePassword, hashPassword } from "services/user.service";

const isEmailExist = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username: email,
    }
  })
  if(user) {return true;}
  return false;
}

const registerNewUser = async (
  fullName: string,
  email: string,
  password: string
) => {
  const defaultPassword = await hashPassword(password);
  const userRoleId = await prisma.role.findUnique({
    where: {
      name: "USER"
    }
  });
  const user = await prisma.user.create({
    data:{
      fullName: fullName,
      username: email,
      password: defaultPassword,
      roleId: userRoleId.id,
      accountType: ACCOUNT_TYPE.SYSTEM
    }
  });
  return user;
}

const getUserWithRoleById = async (id: string) => {
  const user = prisma.user.findUnique({
    where: {id: +id},
    include:{
      role: true
    },
    omit: {
      password: true, // Exclude the 'password' field
    },
  }) ;
  return user;
}

export {isEmailExist, registerNewUser, getUserWithRoleById}