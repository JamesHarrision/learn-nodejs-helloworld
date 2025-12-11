import { prisma } from "config/client";
import { Response, Request } from "express";
import { addProductToCart, deleteCartDetailByID, getCartDetail, getProductById } from "services/client/item.service";

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
    const cartdetails = await getCartDetail(user); 
    let totalPrice = 0;
    if(cartdetails){
      cartdetails.forEach((item) => totalPrice += item.product.price * item.quantity);
    }
    console.log(cartdetails);
    res.render('client/product/cart', {
      cartdetails,
      totalPrice
    });
  }
}

const handleDeleteCartDetail = async (req: Request, res: Response) => {
  const {id} = req.params;
  const user = req.user;
  
  if(!user) res.redirect("/login");

  await deleteCartDetailByID(+id, user);
  res.redirect('/cart');
}



export {getProductPage, postAddProductToCart, getCartPage, handleDeleteCartDetail}