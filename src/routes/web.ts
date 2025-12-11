import express, { Express } from 'express'
import { getHomePage, getCreateUserPage, postCreateUser, postDeleteUser, getViewUser, postUpdateUser } from 'controllers/user.controller';
import { getAdminOrderPage, getAdminProductPage, getAdminUserPage, getDashboardPage } from 'controllers/admin/dashboard.controller';
import passport from 'passport';
import multer from 'multer';
import fileUploadMiddleware from 'src/middleware/multer';
import { getProductPage, postAddProductToCart } from 'controllers/client/product.controller';
import { getAdminCreateProductPage, getAdminViewProduct, postAdminCreateProduct, postDeletProduct, postUpdateAdminProduct } from 'controllers/admin/product.controller';
import { getLoginPage, getRegisterPage, getSucessRedirectPage, postLogout, postRegisterUser } from 'controllers/client/auth.controller';
import { isAdmin, isLogin } from 'src/middleware/auth';

const upload = multer({ dest: 'uploads/' })

const router = express.Router();

const webRoutes = (app: Express) => {
  router.get("/", getHomePage);
  router.get("/product/:id", getProductPage);

  //admin routes:
  router.get("/admin", getDashboardPage);
  router.get("/admin/user", getAdminUserPage);
  router.get("/admin/create-user", getCreateUserPage);
  router.post('/admin/handle-create-user', fileUploadMiddleware('avatar'), postCreateUser);
  router.post("/admin/delete-user/:id", postDeleteUser);
  router.get("/admin/view-user/:id", getViewUser);
  router.post("/admin/update-user", fileUploadMiddleware('avatar'), postUpdateUser);


  router.get("/admin/product", getAdminProductPage);
  router.get("/admin/create-product", getAdminCreateProductPage);
  router.post("/admin/create-product", fileUploadMiddleware('image', 'images/product'), postAdminCreateProduct);
  router.get("/admin/view-product/:id", getAdminViewProduct);
  router.post("/admin/update-product", fileUploadMiddleware('image', 'images/product'), postUpdateAdminProduct);
  router.post("/admin/delete-product/:id", postDeletProduct);

  router.post("/add-product-to-cart/:id", postAddProductToCart);

  //Auth
  router.get("/login", getLoginPage);
  router.get("/success-redirect", getSucessRedirectPage);
  router.post("/login", passport.authenticate('local', {
    successRedirect: '/success-redirect',
    failureRedirect: '/login',
    failureMessage: true,
  }));
  router.post("/logout", postLogout)
  router.get("/register", getRegisterPage);
  router.post("/register", postRegisterUser);

  router.get("/admin/order", getAdminOrderPage);


  app.use('/', isAdmin, router);
}

export default webRoutes;