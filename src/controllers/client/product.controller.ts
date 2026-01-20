import { prisma } from "config/client";
import { Response, Request } from "express";
import { addProductToCart, deleteCartDetailByID, getCartDetail, getProductById, handlePlaceOrder, updateCartDetailBeforeCheckout } from "services/client/item.service";

const getProductPage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await getProductById(+id);
  return res.render('client/product/detail.ejs', {
    product
  });
}

const postAddProductToCart = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  if (user) {
    await addProductToCart(1, +id, user);
  } else {
    await res.redirect('/login');
  }

  return res.redirect('/');
}

const getCartPage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) res.redirect('/login');
  else {
    const cartDetails = await getCartDetail(user);
    let totalPrice = 0;
    if (cartDetails) {
      cartDetails.forEach((item) => totalPrice += item.product.price * item.quantity);
    }

    const cartId = (cartDetails.length > 0) ? cartDetails[0].cartId : 0;
    console.log(cartDetails);

    res.render('client/product/cart', {
      cartDetails,
      totalPrice,
      cartId: cartId,
    });
  }
}

const handleDeleteCartDetail = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  if (!user) res.redirect("/login");

  await deleteCartDetailByID(+id, user);
  res.redirect('/cart');
}

const getCheckoutPage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) res.redirect('/login');
  else {
    const cartDetails = await getCartDetail(user);
    let totalPrice = 0;
    if (cartDetails) {
      cartDetails.forEach((item) => totalPrice += item.product.price * item.quantity);
    }
    res.render('client/product/checkout', {
      cartDetails,
      totalPrice
    });
  }
}

const postHandleCartToCheckout = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) res.redirect("/login");

  const currentCartDetail: { id: string, quantity: string, cartId: string }[]
    = req.body?.cartDetails ?? [];

  await updateCartDetailBeforeCheckout(currentCartDetail);

  return res.redirect("/checkout")
}

const postPlaceOrder = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) res.redirect("/login");

  const { receiverName, receiverAddress, receiverPhone } = req.body;
  const { totalPrice } = req.body;
  await handlePlaceOrder(user.id, receiverName, receiverAddress, receiverPhone, totalPrice);

  return res.redirect("/thanks")
}

const getThanksPage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) res.redirect("/login");



  return res.render("client/product/thanks")
}



export {
  getProductPage, postAddProductToCart, getCartPage,
  handleDeleteCartDetail, getCheckoutPage, postHandleCartToCheckout, postPlaceOrder, getThanksPage
}