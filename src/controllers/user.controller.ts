import {Request, Response} from 'express'
import { getAllUsers, handleCreateUser, handleDeleteUser, getUserById } from 'services/user.service';

const getHomePage = async (req: Request, res: Response) => {
  //(?) get users
  const users = await getAllUsers();
  return res.render('home.ejs', {
    users: users,
  });
}

const getCreateUserPage = (req: Request, res: Response) => {
  return res.render('create-user.ejs');
}

const postCreateUser = async (req: Request, res: Response) => {
  // console.log(">>> Request data: ", req.body);
  const {fullName, email, address} = req.body;
 
  //handle create user
  await handleCreateUser(fullName, email, address);

  return res.redirect("/");
}

const postDeleteUser = async (req: Request, res: Response) => {
  const {id} = req.params;
  await handleDeleteUser(id);
  return res.redirect("/");
}

const getViewUser = async (req: Request, res: Response) => {
  const {id} = req.params;
  //get user by id
  const user = await getUserById(id);
  return res.render("view-user.ejs", {
    id: id,
    user: user,
  });
}


export {getHomePage, getCreateUserPage, postCreateUser, postDeleteUser, getViewUser}