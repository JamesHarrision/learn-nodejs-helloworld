import {Request, Response} from 'express'
import { getAllUsers, handleCreateUser } from '../services/user.service';

const getHomePage = async (req: Request, res: Response) => {
  //(?) get users
  const users = await getAllUsers();
  console.log(users);
  return res.render('home.ejs', {
    name: "users",
  });
}

const getCreateUserPage = (req: Request, res: Response) => {
  return res.render('create-user.ejs');
}

const postCreateUser = (req: Request, res: Response) => {
  // console.log(">>> Request data: ", req.body);
  const {fullName, email, address} = req.body;
  
  //handle create user
  handleCreateUser(fullName, email, address);

  return res.redirect("/");
}

export {getHomePage, getCreateUserPage, postCreateUser}