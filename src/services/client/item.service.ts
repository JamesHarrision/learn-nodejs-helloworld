import { User } from "@prisma/client";
import { prisma } from "config/client"
import { getUserSumCart } from "./auth.service";
import { number, string } from "zod";

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
    where: { userId: user.id }
  });

  if (!cart) return;

  const myFullCart = await prisma.cartDetail.findMany({
    where: { cartId: cart.id },
    include: {
      product: true
    }
  });
  return myFullCart
}

const deleteCartDetailByID = async (id: number, user: Express.User) => {
  const cartDetail = await prisma.cartDetail.findUnique({
    where: { id: +id }
  });

  if (!cartDetail) throw new Error('Cart detail not found');

  const sumCart = await getUserSumCart("" + user.id);

  await prisma.cartDetail.delete({ where: { id: cartDetail.id } });

  if (sumCart - cartDetail.quantity > 0) {
    // còn sản phẩm → update sum
    await prisma.cart.update({
      where: { userId: user.id },
      data: {
        sum: {
          decrement: cartDetail.quantity
        }
      }
    });
  } else {
    // không còn sản phẩm → xóa cart
    await prisma.cart.delete({
      where: { userId: user.id }
    });
  }
}

const updateCartDetailBeforeCheckout = async (data: { id: string, quantity: string, cartId: string }[]) => {
  let quantity = 0;
  for (let i = 0; i < data.length; i++) {
    quantity += +data[i].quantity;
    await prisma.cartDetail.update({
      where: { id: +data[i].id },
      data: { quantity: +data[i].quantity }
    });
  }

  const cartId = data[0].cartId;
  await prisma.cart.update({
    where: {
      id: +cartId
    },
    data: {
      sum: +quantity
    }
  });
}

const handlePlaceOrder = async (
  userId: number,
  receiverName: string,
  receiverAddress: string,
  receiverPhone: string,
  totalPrice: number
) => {
  await prisma.$transaction(async (tx) => {

    const cart = await tx.cart.findUnique({
      where: { userId: userId },
      include: {
        cartDetatails: true
      }
    });

    //Check tồn kho
    if (cart) {
      const dataOrderDetail = cart?.cartDetatails.map((item) => ({
        price: +item.price,
        quantity: +item.quantity,
        productId: +item.productId
      })) ?? [];

      for (let i = 0; i < cart.cartDetatails.length; i++) {

        const productId = cart.cartDetatails[i].productId;
        const product = await tx.product.findUnique({
          where: {
            id: productId
          }
        });

        if (!product || product.quantity < cart.cartDetatails[i].quantity) {
          throw new Error(`Sản phẩm ${product?.name} không tồn tại hoặc không đủ số lượng`);
        }

        await tx.product.update({
          where: {
            id: productId
          },
          data: {
            quantity: {
              decrement: cart.cartDetatails[i].quantity
            },
            sold: {
              increment: cart.cartDetatails[i].quantity
            }
          }
        })
      }

      //create order
      await tx.order.create({
        data: {
          receiverName,
          receiverAddress,
          receiverPhone,
          paymentMethod: "COD",
          paymentStatus: "PAYMENT_UNPAID",
          status: "PENDING",
          totalPrice: +totalPrice,
          userId,
          orderDetails: {
            create: dataOrderDetail
          }
        }
      });

      //remove cart + cart-detail
      await tx.cartDetail.deleteMany({ where: { cartId: cart.id } });
      await tx.cart.delete({ where: { id: cart.id } });
    }
  });
}

export { getProduct, getProductById, addProductToCart, getCartDetail, deleteCartDetailByID, updateCartDetailBeforeCheckout, handlePlaceOrder }