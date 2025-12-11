import { Response, Request } from "express";
import { addProductToCart, getProductById } from "services/client/item.service";

const getProductPage = async (req: Request, res: Response) => {
  const {id} = req.params;
  const product = await getProductById(+id);
  return res.render('client/product/detail.ejs', {
    product
  });
}

const postAddProductToCart = async (req: Request, res: Response) => {
  const {id} = req.params;
  const user = req.user;

  if(user){
    await addProductToCart(1, +id, user);
  }else{
    await res.redirect('/login');
  }

  return res.redirect('/');
}

const getCartPage = async (req: Request, res: Response) => {
  const user = req.user;
  if(!user) res.redirect('/login');
  else{
    res.render('client/product/cart');
  }
}

export {getProductPage, postAddProductToCart, getCartPage}