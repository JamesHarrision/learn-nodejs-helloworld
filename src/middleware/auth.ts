import { NextFunction, Request, Response } from "express"
import { User } from "@prisma/client";

const isLogin = (req: Request, res: Response, next: NextFunction) => {
  const isAuthenticated = req.isAuthenticated();
  if(isAuthenticated){
    res.redirect('/');
    return;
  }else{
    next();
  }
}

const isAdmin= (req: Request, res: Response, next: NextFunction) => {
  const  user = req.user;
  if(user?.role?.name === 'ADMIN'){
    next();
  }else{
    res.redirect('/');
  }
}

export {isLogin, isAdmin}