import { Request, Response } from 'express'
import { countTotalOrderPages, getAllOrders } from 'services/admin/order.service';
import { countTotalProductPage, getProductList } from 'services/admin/product.service';
import { countTotalUserPage, getAllUsers } from 'services/user.service';

const getDashboardPage = async (req: Request, res: Response) => {
  return res.render('admin/dashboard/show.ejs');
}

const getAdminUserPage = async (req: Request, res: Response) => {

  const { page } = req.query;
  let currentPage = Number(page) ? Number(page) : 1;
  if (currentPage <= 0) currentPage = 1;

  const users = await getAllUsers(currentPage);
  const totalPages = await countTotalUserPage();

  return res.render('admin/user/show.ejs', {
    page: +currentPage,
    users: users,
    totalPages: +totalPages
  });
}

const getAdminProductPage = async (req: Request, res: Response) => {
  const { page } = req.query;
  let currentPage = Number(page) ? Number(page) : 1;
  if (currentPage <= 0) currentPage = 1;

  const products = await getProductList(currentPage);
  const totalPages = await countTotalProductPage();

  return res.render('admin/product/show.ejs', {
    products,
    page: +currentPage,
    totalPages: +totalPages
  });
}

const getAdminOrderPage = async (req: Request, res: Response) => {
  const { page } = req.query;
  
  let currentPage = Number(page) ? Number(page) : 1;
  if(currentPage <= 0) currentPage = 1;

  const orders = await getAllOrders(currentPage);
  const totalPage = await countTotalOrderPages();

  console.log(orders);
  return res.render('admin/order/show.ejs', {
    orders,
    page: +currentPage,
    totalPages: +totalPage
  });
}


export { getDashboardPage, getAdminUserPage, getAdminOrderPage, getAdminProductPage }