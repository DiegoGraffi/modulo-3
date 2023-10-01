const express = require("express");
const app = express();
const path = require("path");
const PORT = 3000;
const fs = require("fs");

const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const unDia = 1000 * 60 * 60 * 24;

const indexRouter = require("./routes/index");
const cartRouter = require("./routes/cart");
const detailProductRouter = require("./routes/detailProduct");
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");

const loginController = require("./controllers/loginController");

app.use(
  sessions({
    secret: "123456",
    saveUninitialized: true,
    cookie: { maxAge: unDia },
    resave: false,
  })
);
app.use(cookieParser());

const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const { body, validationResult } = require("express-validator");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.listen(PORT, () => console.log("listening on port ", PORT));

app.set("views", path.resolve(__dirname, "./views"));

const jsonProducts = fs.readFileSync("src/products.json", "utf-8");
let products = JSON.parse(jsonProducts);

app.use("/", indexRouter);
app.use("/cart", cartRouter);
app.use("/detailProduct", detailProductRouter);
app.use("/login", loginRouter, loginController);
app.use("/register", registerRouter);

/* Registro */

const jsonUsers = fs.readFileSync("src/users.json", "utf-8");
let users = JSON.parse(jsonUsers);

app.get("/register", (req, res) => {
  if (req.session.email) {
    res.redirect("/");
    return;
  }
  res.render("./register");
});

app.post(
  "/register",
  [
    body("name", "Ingrese su nombre").exists().isLength({ min: 3 }),

    body("lastName", "Ingrese su apellido").exists(),

    body("email", "Ingrese un email válido").trim().exists().isEmail(),

    body("password", "La contraseña debe tener entre 6 y 18 caracteres")
      .exists()
      .trim()
      .isString()
      .isLength({ min: 6, max: 18 }),

    body("repeatPassword")
      .exists()
      .trim()
      .isString()
      .isLength({ min: 6, max: 20 })
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Las contraseñas deben coincidir");
        }
        return true;
      }),
  ],
  (req, res) => {
    const errors = validationResult(req);
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
  }
);
