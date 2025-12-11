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

  if (cart) {
    //update
    //cap nhat sum
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        sum: { increment: +quantity }
      }
    });

    //cap nhat cartdetail
    const currentCartDetail = await prisma.cartDetail.findFirst({
      where: {
        productId: +productId,
        cartId: cart.id
      }
    });

    await prisma.cartDetail.upsert({
      where: {
        id: currentCartDetail?.id ?? 0
      },
      update: {
        quantity: {
          increment: +quantity
        }
      },
      create: {
        price: product.price,
        quantity: +quantity,
        productId: +productId,
        cartId: +cart.id
      },
    });

  } else {
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

const getCartDetail = async (user: Express.User) => {
  const cart = await prisma.cart.findUnique({
    where: {userId: user.id}
  });

  const myFullCart = await prisma.cartDetail.findMany({
    where: {cartId: cart.id},
    include: {
      product: true
    }
  });
  return myFullCart
}

export { getProduct, getProductById, addProductToCart, getCartDetail}