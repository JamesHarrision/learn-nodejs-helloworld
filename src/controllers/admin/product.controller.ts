import { Response, Request } from "express";
import { ProductSchema, TProductSchema } from "src/validation/product.schema";

const getAdminCreateProductPage = (req: Request, res: Response) => {
  return res.render('admin/product/create.ejs');
}

const postAdminCreateProductPage = (req: Request, res: Response) => {
  const {} = req.body as TProductSchema;

  try{
    const result = ProductSchema.parse(req.body);
    console.log("Run oke !");

  } catch( error){
    console.log("Run error !", error);
    
  }

  return res.redirect('/admin/product');
}

export {getAdminCreateProductPage, postAdminCreateProductPage}