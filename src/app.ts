import express from "express"
import 'dotenv/config'
import webRoutes from "src/routes/web";
import getConection from "src/config/database";
import initDatabase from "config/seed";
import passport from "passport";
import configPassportLocal from "src/middleware/passport.local";
import session from "express-session";

const app = express();
const PORT = process.env.PORT || 8080;

//Config view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//config request.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Config static files: (css - images - javascripts)
app.use(express.static('public'));

//Config session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))

//Config passport
app.use(passport.initialize());
app.use(passport.authenticate('session'));
configPassportLocal();

//Config routes
webRoutes(app);

// //Config database
// getConection();

//seeding data
initDatabase();

//catch 404 - page not found
app.use(function (req, res) {
  res.send("404 PAGE NOT FOUND")
});

app.listen(8080, () => {
  console.log(`My app is running on port: ${PORT}`);
});