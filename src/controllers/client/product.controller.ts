import { prisma } from "config/client";
import { Response, Request } from "express";
import { addProductToCart, countTotalClientProductPages, deleteCartDetailByID, getCartDetail, getProduct, getProductById, handlePlaceOrder, updateCartDetailBeforeCheckout } from "services/client/item.service";

const getShopPage = async (req: Request, res: Response) => {

  const { page } = req.query;
  let currentPage = Number(page) ? Number(page) : 1;
  if (currentPage <= 0) currentPage = 1;

  const products = await getProduct(+currentPage, 9);
  const totalPages = await countTotalClientProductPages(9);
  return res.render('client/product/shop', {
    products,
    page: +currentPage,
    totalPages: +totalPages
  });
}

const getProductPage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await getProductById(+id);
  return res.render('client/product/detail.ejs', {
    product
  });
}

const postAddProductToCart = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { shopping } = req.body;
  const user = req.user;

  if (user) {
    await addProductToCart(1, +id, user);
  } else {
    await res.redirect('/login');
  }

  if (shopping) res.redirect('/products')
  return res.redirect('/');
}

const getCartPage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect('/login');
  else {
    const cartDetails = await getCartDetail(user);
    let totalPrice = 0;
    if (cartDetails) {
      cartDetails.forEach((item) => totalPrice += item.product.price * item.quantity);
      // console.log(cartDetails);
      const cartId = (cartDetails.length > 0) ? cartDetails[0].cartId : 0;
      return res.render('client/product/cart', {
        cartDetails,
        totalPrice,
        cartId: cartId,
      });
    }
    else {
      return res.render('client/product/cart', {
        cartDetails,
        totalPrice: 0,
        cartId: 0
      });
    }

  }
}

const handleDeleteCartDetail = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  if (!id) res.redirect('/cart');
  if (!user) return res.redirect("/login");

  await deleteCartDetailByID(+id, user);
  return res.redirect('/cart');
}

const getCheckoutPage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect('/login');
  else {
    const cartDetails = await getCartDetail(user);
    let totalPrice = 0;
    if (cartDetails) {
      cartDetails.forEach((item) => totalPrice += item.product.price * item.quantity);
    }
    return res.render('client/product/checkout', {
      cartDetails,
      totalPrice
    });
  }
}

const postHandleCartToCheckout = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect("/login");

  const currentCartDetail: { id: string, quantity: string, cartId: string }[]
    = req.body?.cartDetails ?? [];

  await updateCartDetailBeforeCheckout(currentCartDetail);

  return res.redirect("/checkout")
}

const postPlaceOrder = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.redirect("/login");

    const { receiverName, receiverAddress, receiverPhone } = req.body;
    const { totalPrice } = req.body;


    await handlePlaceOrder(user.id, receiverName, receiverAddress, receiverPhone, totalPrice);

    return res.redirect("/thanks");
  } catch (error: any) {
    return res.redirect("/checkout");
  }
}

const getThanksPage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect("/login");
  return res.render("client/product/thanks")
}

export {
  getProductPage, postAddProductToCart, getCartPage,
  handleDeleteCartDetail, getCheckoutPage, postHandleCartToCheckout, postPlaceOrder, getThanksPage, getShopPage
}