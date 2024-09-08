const express = require("express");
const route = express.Router();
const authController = require("../controllers/auth.controller");
const { body } = require("express-validator");
const User = require("../models/user.model");

route.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Enter Valid Email")
      .custom(async (value, { req }) => {
        const userDoc = await User.findOne({ email: value });
        if (userDoc) {
          return Promise.reject("Email already exists");
        }
      }),
  ],
  authController.singup
);
route.post(
  "/login",
  [body("email").isEmail().withMessage("Enter Valid Email").normalizeEmail()],
  authController.login
);

module.exports = route;
