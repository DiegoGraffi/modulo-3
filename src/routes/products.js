const express = require("express");
const router = express.Router();
const productsList = require("../products.json");
const fs = require("fs");

const jsonUsers = fs.readFileSync("src/users.json", "utf-8");
let users = JSON.parse(jsonUsers);

router.get("/", (req, res) => {
  const user = users.find((user) => user.email === req.session.email);
  res.render("index", { user });
});

router.get("/cart", (req, res) => {
  const user = users.find((user) => user.email === req.session.email);
  res.render("cart", { user });
});

router.get("/product/:id", (req, res) => {
  const user = users.find((user) => user.email === req.session.email);
  const id = parseInt(req.params.id);
  const product = productsList.find((producto) => producto.id === id);

  if (!product) {
    res.render("productNotFound", { id: id });
  } else {
    res.render("detailProduct", { product: product, user });
  }
});

module.exports = router;
