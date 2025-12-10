import { NextFunction, Request, Response } from "express"
import { User } from "@prisma/client";

const isLogin = (req: Request, res: Response, next: NextFunction) => {
  const isAuthenticated = req.isAuthenticated();
  if (isAuthenticated) {
    res.redirect('/');
    return;
  } else {
    next();
  }
}

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  //Admin routes
  if (req.path.startsWith('/admin')) {
    const user = req.user;
    if (user?.role?.name === 'ADMIN') {
      next();
    } else {
      // res.redirect('/');
      res.render('status/403.ejs');
    }

    return;
  }

  //Client routes
  next();
}

export { isLogin, isAdmin }