const express = require("express");
const app = express();
const path = require("path");
const PORT = 3000;

const cookieParser = require("cookie-parser");
const sessions = require("express-session");

const authRouter = require("./routes/auth");
const productsRouter = require("./routes/products");

const unDia = 1000 * 60 * 60 * 24;

app.use(
  sessions({
    secret: "123456",
    saveUninitialized: true,
    cookie: { maxAge: unDia },
    resave: false,
  })
);
app.use(cookieParser());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.listen(PORT, () => console.log("listening on port ", PORT));

app.set("views", path.resolve(__dirname, "./views"));

app.use("/", authRouter, productsRouter);
