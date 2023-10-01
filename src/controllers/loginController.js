/* LOGIN CONTROLLER */

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const fs = require("fs");
const users = require("../app");

router.get("/login", (req, res) => {
  if (req.session.email) {
    res.redirect("/");
    return;
  }
  res.render("./login", {});
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((user) => user.email === email);

  if (!user) {
    res.send("No se encuentra el usuario");
    return;
  }

  const validacionPassword = await bcrypt.compare(password, user.passwordHash);

  if (!validacionPassword) {
    res.send("La contrasena es incorrecta");
  } else {
    req.session.email = user.email;
    res.redirect("/");
  }
});

module.exports = router;
