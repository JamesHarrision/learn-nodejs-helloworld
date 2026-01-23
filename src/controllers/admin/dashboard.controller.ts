import { Request, Response } from 'express'
import { getAllOrders } from 'services/admin/order.service';
import { getProductList } from 'services/admin/product.service';
import { getAllUsers } from 'services/user.service';

const getDashboardPage = async (req: Request, res: Response) => {
  return res.render('admin/dashboard/show.ejs');
}

const getAdminUserPage = async (req: Request, res: Response) => {

  const { page } = req.query;
  let currentPage = Number(page) ? Number(page) : 1;
  if(currentPage <= 0) currentPage = 1;

  const users = await getAllUsers(currentPage);
  return res.render('admin/user/show.ejs', {
    users: users
  });
}

const getAdminProductPage = async (req: Request, res: Response) => {
  const products = await getProductList();
  return res.render('admin/product/show.ejs', { products });
}

const getAdminOrderPage = async (req: Request, res: Response) => {
  const orders = await getAllOrders();
  console.log(orders);
  return res.render('admin/order/show.ejs', {
    orders
  });
}


export { getDashboardPage, getAdminUserPage, getAdminOrderPage, getAdminProductPage }