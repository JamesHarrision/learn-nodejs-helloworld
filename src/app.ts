import express from "express"
import 'dotenv/config'
import webRoutes from "./routes/web";
import getConection from "./config/database";
import initDatabase from "config/seed";

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

//Config routes
webRoutes(app);

// //Config database
// getConection();

//seeding data
initDatabase();

app.listen(8080, () => {
  console.log(`My app is running on port: ${PORT}`);
  // console.log(`${__dirname + '/views'}`);
});