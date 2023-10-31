const bcrypt = require("bcrypt");
const fs = require("fs");
const { body, validationResult } = require("express-validator");

const registerGet = (req, res) => {
  if (req.session.email) {
    res.redirect("/");
    return;
  }
  res.render("./register");
};

const registerPost = (req, res) => {
  const errors = validationResult(req);

  const jsonUsers = fs.readFileSync("src/users.json", "utf-8");
  let users = JSON.parse(jsonUsers);

  if (!errors.isEmpty()) {
    console.log(req.body);
    const valores = req.body;
    const validaciones = errors.array();
    res.render("register", { validaciones: validaciones, valores: valores });
  } else {
    const { name, lastName, email, date, password } = req.body;
    if (!name || !lastName || !email || !date || !password) {
      res.status(400);
      return;
    }

    const passwordHash = bcrypt.hashSync(req.body.password, 12);

    let newUser = {
      name,
      lastName,
      email,
      date,
      passwordHash,
    };

    users.push(newUser);

    const jsonUsers = JSON.stringify(users);
    fs.writeFileSync("src/users.json", jsonUsers, "utf-8");

    res.redirect("/");
  }
};

function loginGet(req, res) {
  if (req.session.email) {
    res.redirect("/");
    return;
  }
  res.render("./login", {});
}

async function loginPost(req, res) {
  const { email, password } = req.body;

  const jsonUsers = fs.readFileSync("src/users.json", "utf-8");
  let users = JSON.parse(jsonUsers);

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
}

module.exports = {
  registerGet,
  registerPost,
  loginGet,
  loginPost,
};
