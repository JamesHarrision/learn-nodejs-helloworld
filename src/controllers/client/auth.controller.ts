import { error } from "console";
import { NextFunction, Request, Response } from "express";
import { registerNewUser } from "services/client/auth.service";
import { RegisterSchema, TRegisterSchema } from "src/validation/register.schema";

const getLoginPage = (req: Request, res: Response) => {
  const {session} = req as any;
  const messages  = session?.messages || [];
  return res.render('client/auth/login.ejs', {
    messages
  });
}

const getRegisterPage = (req: Request, res: Response) => {
  const errors = [];
  const oldData = [];
  return res.render('client/auth/register.ejs', {
    errors,
    oldData
  });
}

const postRegisterUser = async (req: Request, res: Response) => {
  const {fullName, email, password, confirmPassword} = req.body as TRegisterSchema
  
  const validate = await RegisterSchema.safeParseAsync(req.body);
  
  if (!validate.success) {
    //Error
    const errorsZod = validate.error.issues;
    const oldData = { fullName, email, password, confirmPassword}
    const errors = errorsZod?.map(item => `${item.message} [${item.path[0]}]`);
    console.log(errors);
    return res.render('client/auth/register.ejs', {
      errors,
      oldData
    });
  }

  //success
  await registerNewUser(fullName, email, password);
 return res.redirect("/login");
}

const getSucessRedirectPage = (req: Request, res: Response) => {
  const  user = req.user as any;
  if(user?.role?.name === 'ADMIN'){
    res.redirect('/admin');
  }else{
    res.redirect('/');
  }
}

const postLogout = (req: Request, res: Response, next: NextFunction) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
}



export {getLoginPage, getRegisterPage, postRegisterUser, getSucessRedirectPage, postLogout}