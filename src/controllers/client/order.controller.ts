import { Request, Response } from "express";
import { getOrderAndOrderDetail } from "services/admin/order.service";

const getOrderHistoryPage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    res.redirect('/login');
  }

  const data = await getOrderAndOrderDetail(Number(user.id));
  res.render('client/product/orderHistory', {
    orders: data
  });

}

export { getOrderHistoryPage }