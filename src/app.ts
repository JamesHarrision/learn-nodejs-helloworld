import express from "express"
import 'dotenv/config'
import webRoutes from "src/routes/web";
import getConection from "src/config/database";
import initDatabase from "config/seed";
import passport from "passport";
import configPassportLocal from "src/middleware/passport.local";
import session from "express-session";
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import  { PrismaClient } from '@prisma/client';

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
app.use(session(
  {
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: 'a santa at nasa',

    //Forces session save even if it unchanged
    resave: false,

    //Save unmodified session
    saveUninitialized: false,
    store: new PrismaSessionStore(
      new PrismaClient(),
      {
        checkPeriod: 1 * 24 * 60 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  }
));

//Config passport
app.use(passport.initialize());
app.use(passport.authenticate('session'));
configPassportLocal();

//config user global
app.use((req, res, next) => { 
    res.locals.user = req.user || null; // Pass user object to all views 
    next(); 
}); 

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