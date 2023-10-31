const express = require("express");
const authController = require("../controllers/auth");
const { body } = require("express-validator");

const router = express.Router();

const registerValidator = [
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
];

// Register
router.get("/register", authController.registerGet);
router.post("/register", registerValidator, authController.registerPost);

// Login
router.get("/login", authController.loginGet);
router.post("/login", authController.loginPost);

module.exports = router;
