import { prisma } from "config/client"
import { hashPassword } from "services/user.service";
import { ACCOUNT_TYPE } from "./constant";

const initDatabase = async () => {
  const countUser = await prisma.user.count();
  const countRow = await prisma.role.count();

  if (countUser === 0) {
    const defaultPassword = await hashPassword("123456");
    await prisma.user.createMany({
      data: [
        {
          fullName: "Admin",
          username: 'abc@gmail.com',
          password: defaultPassword,
          accountType: ACCOUNT_TYPE.SYSTEM
        },
        {
          fullName: "Jack1e",
          username: 'dev@gmail.com',
          password: defaultPassword,
          accountType: ACCOUNT_TYPE.SYSTEM
        }
      ]
    });
  }else if(countRow === 0){
    await prisma.role.createMany({
      data: [
        {
          name: "ADMIN",
          description: "Admin thì full quyền"
        },
        {
          name: "USER",
          description: "User thông thường"
        }
      ]
    });
  }else{
    console.log('Already init data');
  }
}

export default initDatabase;