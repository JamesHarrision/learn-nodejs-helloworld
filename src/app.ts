import express from "express"
import 'dotenv/config'
import webRoutes from "./routes/web";

const app = express();
const PORT = process.env.PORT || 8080;

//Config template engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//Config routes
webRoutes(app);

//Config static files: (css - images - javascripts)
app.use(express.static('public'));

app.listen(8080, () => {
  console.log(`My app is running on port: ${PORT}`);
  // console.log(`${__dirname + '/views'}`);
});