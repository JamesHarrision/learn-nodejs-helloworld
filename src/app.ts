import express from "express"
import 'dotenv/config'

const app = express();
const PORT = process.env.PORT || 8080;

//Config template engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get("/", (req, res) => {
  res.render('home.ejs');
});

app.get("/jack1e", (req, res) => {
  res.send('Hello Jack1e');
});

app.get("/abc", (req, res) => {
  res.send('Hello abc');
});

app.listen(8080, () => {
  console.log(`My app is running on port: ${PORT}`);
  console.log(`${__dirname + '/views'}`);
});