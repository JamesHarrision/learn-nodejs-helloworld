import { Request, Response } from "express";
import { getAllOrderDetail } from "services/admin/order.service";

const getAdminOrderDetail = async (req: Request, res: Response) => {
  const {id} = req.params;
  const orderDetails = await getAllOrderDetail(id) ?? [];
  console.log(orderDetails);
  res.render('admin/order/detail.ejs', {
    orderDetails
  })
}

export {getAdminOrderDetail}