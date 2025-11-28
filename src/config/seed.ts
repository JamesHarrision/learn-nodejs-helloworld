import { prisma } from "config/client"

const initDatabase = async () => {
  const countUser = await prisma.user.count();
  if (countUser === 0) {
    await prisma.user.createMany({
      data: [
        {
          username: 'abc@gmail.com',
          password: '1234567',
          accountType: 'system'
        },
        {
          username: 'dev@gmail.com',
          password: '1234567',
          accountType: 'admin'
        }
      ]
    });
  }else{
    console.log('Already init data');
  }
}

export default initDatabase;