import express from "express"

const app = express();
const PORT = 8080;

app.get("/", (req, res) => {
  res.send('Hello World update');
});

app.get("/jack1e", (req, res) => {
  res.send('Hello Jack1e');
});

app.listen(8080, () => {
  console.log(`My app is running on port: ${PORT}`);
});