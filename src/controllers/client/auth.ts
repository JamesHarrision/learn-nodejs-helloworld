import { Request, Response } from "express";

const getLoginPage = (req: Request, res: Response) => {
  return res.render('client/auth/login.ejs');
}

const getRegisterPage = (req: Request, res: Response) => {
  return res.render('client/auth/register.ejs');
}

export {getLoginPage, getRegisterPage}