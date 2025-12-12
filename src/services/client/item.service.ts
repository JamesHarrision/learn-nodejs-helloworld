import { User } from "@prisma/client";
import { prisma } from "config/client"
import { getUserSumCart } from "./auth.service";

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

  if(!cart) return;

  const myFullCart = await prisma.cartDetail.findMany({
    where: {cartId: cart.id},
    include: {
      product: true
    }
  });
  return myFullCart
}


const deleteCartDetailByID = async (id: number, user: Express.User) => {
  const cartDetail = await prisma.cartDetail.findUnique({
    where: {id: +id}
  });

  await prisma.cartDetail.delete({where: {id: cartDetail.id}});
  const sumCart = await getUserSumCart(""+user.id);
  if(sumCart - cartDetail.quantity > 1){
    //update
    await prisma.cart.update({
      where: {userId: user.id},
      data: {
        sum:{
          decrement: cartDetail.quantity
        }
      }
    })
  }else{
    await prisma.cart.delete({where: {userId: user.id}});
  }
}

const updateCartDetailBeforeCheckout = async (data: {id: string, quantity: string}[]) => {
  for(let i=0;i<data.length;i++){
    await prisma.cartDetail.update({
      where: {id: +data[i].id},
      data: {quantity: +data[i].quantity}
    });
  }
}

export { getProduct, getProductById, addProductToCart, getCartDetail, deleteCartDetailByID, updateCartDetailBeforeCheckout}