import { prisma } from "config/client"
import { hashPassword } from "services/user.service";
import { ACCOUNT_TYPE } from "./constant";

const initDatabase = async () => {
  const countUser = await prisma.user.count();
  const countRow = await prisma.role.count();

  if (countRow === 0) {
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
  } 

  if (countUser === 0) {
    const defaultPassword = await hashPassword("123456");
    const adminRole = await prisma.role.findFirst({
      where: {
        name: "ADMIN"
      }
    });
    if (adminRole) {
      await prisma.user.createMany({
        data: [
          {
            fullName: "ADMIN",
            username: 'abc@gmail.com',
            password: defaultPassword,
            accountType: ACCOUNT_TYPE.SYSTEM,
            roleId: adminRole.id
          },
          {
            fullName: "JACK1E",
            username: 'dev@gmail.com',
            password: defaultPassword,
            accountType: ACCOUNT_TYPE.SYSTEM,
            roleId: adminRole.id
          }
        ]
      });
    }
  } 
  if(countRow !== 0 && countUser !== 0){
    console.log('Already init data');
  }
}

export default initDatabase;