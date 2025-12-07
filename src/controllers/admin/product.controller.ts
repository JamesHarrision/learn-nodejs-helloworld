import { name } from "ejs";
import { Response, Request } from "express";
import { handleCreateProduct } from "services/admin/product.service";
import { ProductSchema, TProductSchema } from "src/validation/product.schema";


const getAdminCreateProductPage = (req: Request, res: Response) => {
  const errors = [];
  const oldData = {
    name: "",
    price: "",
    detailDesc: "",
    shortDesc: "",
    quantity: "",
    factory: "",
    target: ""
  }
  return res.render('admin/product/create.ejs', { errors, oldData });
}

const postAdminCreateProduct = async (req: Request, res: Response) => {
  const { name, price, detailDesc, shortDesc, quantity, factory, target } = req.body as TProductSchema;

  const validate = ProductSchema.safeParse(req.body);

  if (!validate.success) {
    //Error
    const errorsZod = validate.error.issues;
    const oldData = { name, price, detailDesc, shortDesc, quantity, factory, target }
    const errors = errorsZod?.map(item => `${item.message} [${item.path[0]}]`);
    console.log(errors);
    return res.render('admin/product/create.ejs', {
      errors,
      oldData
    });
  }

  const image = req?.file?.fieldname ?? null;
  await handleCreateProduct(name, +price, detailDesc, shortDesc, +quantity, factory, target, image);
  return res.redirect('/admin/product');
}

export { getAdminCreateProductPage, postAdminCreateProduct }