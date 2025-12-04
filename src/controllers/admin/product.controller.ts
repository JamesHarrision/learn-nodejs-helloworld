import { Response, Request } from "express";

const getAdminCreateProductPage = (req: Request, res: Response) => {
  return res.render('admin/product/create.ejs');
}

const postAdminCreateProductPage = (req: Request, res: Response) => {

  return res.redirect('admin/product');
}

export {getAdminCreateProductPage, postAdminCreateProductPage}