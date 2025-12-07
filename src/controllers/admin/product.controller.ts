import { name } from "ejs";
import { Response, Request } from "express";
import { deleteProductById, getProductById, handleCreateProduct, updateProductById } from "services/admin/product.service";
import { ProductSchema, TProductSchema } from "src/validation/product.schema";

const factoryOptions = [ 
{ name: "Apple (MacBook)", value: "APPLE" }, 
{ name: "Asus", value: "ASUS" }, 
{ name: "Lenovo", value: "LENOVO" }, 
{ name: "Dell", value: "DELL" }, 
{ name: "LG", value: "LG" }, 
{ name: "Acer", value: "ACER" }, 
];

const targetOptions = [ 
{ name: "Gaming", value: "GAMING" }, 
{ name: "Sinh viên - Văn phòng", value: "SINHVIEN-VANPHONG" }, 
{ name: "Thiết kế đồ họa", value: "THIET-KE-DO-HOA" }, 
{ name: "Mỏng nhẹ", value: "MONG-NHE" }, 
{ name: "Doanh nhân", value: "DOANH-NHAN" }, 
];

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
  const { name, price, detailDesc, shortDesc, quantity, factory, target} = req.body as TProductSchema;

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

  const image = req?.file?.filename ?? null;
  await handleCreateProduct(name, +price, detailDesc, shortDesc, +quantity, factory, target, image);
  return res.redirect('/admin/product');
}

const getAdminViewProduct = async (req: Request, res: Response) => {
  const {id} = req.params;
  const product = await getProductById(id);
  console.log(product);
  return res.render('admin/product/detail.ejs', {
    product: product,
    factoryOptions,
    targetOptions
  });
}

const postUpdateAdminProduct = async (req: Request, res: Response) => {
  const { name, price, detailDesc, shortDesc, quantity, factory, target} = req.body as TProductSchema;
  const id = req.body.id;

  const validate = ProductSchema.safeParse(req.body);

  if (!validate.success) {
    //Error
    const errorsZod = validate.error.issues;
    const oldData = { name, price, detailDesc, shortDesc, quantity, factory, target }
    const errors = errorsZod?.map(item => `${item.message} [${item.path[0]}]`);
    console.log(errors);
    return res.render('admin/product/detail.ejs', {
      errors,
      oldData
    });
  }

  const image = req?.file?.filename ?? null;
  await updateProductById(id, name, price, detailDesc, shortDesc, quantity, factory, target, image);
  return res.redirect('/admin/product');

}

const postDeletProduct = async (req: Request, res: Response) => {
  const {id} = req.params;
  deleteProductById(id);
  return res.redirect('/admin/product');
}

export { getAdminCreateProductPage, postAdminCreateProduct, getAdminViewProduct, postUpdateAdminProduct, postDeletProduct }