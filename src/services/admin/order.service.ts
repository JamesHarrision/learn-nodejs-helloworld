import { prisma } from "config/client";

const getAllOrders = async () => {
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
    }
  });
}

const getAllOrderDetail = async (id: string) => {
  return await prisma.orderDetail.findMany({
    where: {orderId: +id},
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

export {getAllOrders, getAllOrderDetail}