import express, {Express} from 'express'
const router = express.Router();

const webRoutes = (app: Express) => {
  router.get("/", (req, res) => {
    res.render('home.ejs');
  });

  router.get("/jack1e", (req, res) => {
    res.send('Hello Jack1e web');
  });

  router.get("/abc", (req, res) => {
    res.send('Hello abc');
  });

  app.use('/', router);
}

export default webRoutes;