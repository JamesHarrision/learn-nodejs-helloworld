import { User } from "@prisma/client";
import { prisma } from "config/client"

const getProduct = async () => {
  const products = await prisma.product.findMany();
  return products;
}

const getProductById = async (id: Number) => {
  return await prisma.product.findUnique({
    where: {
      id: +id
    }
  });
} 

const addProductToCart = async (quantity: Number = 1, productId: Number, user: Express.User) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId: user.id
    }
  });

  const product = await prisma.product.findUnique({
    where: {
      id: +productId
    }
  })

  if(cart){
    //update
  }else{
    //create
    await prisma.cart.create({
      data: {
        sum: +quantity,
        userId: user.id,
        cartDetatails: {
          create: [
            {
              price: product.price,
              quantity: +quantity,
              productId: product.id
            }
          ]
        }
      }
    });
  }
}

export {getProduct, getProductById, addProductToCart}