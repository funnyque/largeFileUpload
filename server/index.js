const express = require("express");
const app = express();
const path = require("path");
const router = require("./router");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(router);

app.listen(3000, () => {
  console.log("server is running at localhost:3000");
});
