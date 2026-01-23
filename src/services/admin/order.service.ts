import { prisma } from "config/client";
import { TOTAL_ITEMS_PER_PAGE } from "config/constant";

const getAllOrders = async (page: number) => {

  const pageSize = TOTAL_ITEMS_PER_PAGE;
  const skip = (page - 1) * pageSize;

  return await prisma.order.findMany({
    include: {
      user: {
        select: {
          fullName: true // Chỉ lấy field fullName của user
        }
      }
    },
    orderBy: {
      id: 'desc' // (Tùy chọn) Sắp xếp đơn hàng mới nhất lên đầu
    },
    skip: skip,
    take: pageSize
  });
}

const countTotalOrderPages = async () => {
  const pageSize = TOTAL_ITEMS_PER_PAGE;
  const totalProductItems = await prisma.order.count();
  const totalPages = Math.ceil(totalProductItems / pageSize);
  return totalPages;
}

const getAllOrderDetail = async (id: string) => {
  return await prisma.orderDetail.findMany({
    where: { orderId: +id },
    include: {
      product: {
        select: {
          image: true,
          name: true
        }
      }
    }
  })
}

const getOrderAndOrderDetail = async (userId: number) => {
  return await prisma.order.findMany({
    where: {
      userId: userId
    },
    include: {
      orderDetails: {
        include: {
          product: true
        }
      }
    },
  });
}

export { getAllOrders, getAllOrderDetail, getOrderAndOrderDetail, countTotalOrderPages }