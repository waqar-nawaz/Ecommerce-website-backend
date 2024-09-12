const express = require("express");
const route = express.Router();
const authController = require("../controllers/auth.controller");
const userSchema = require('../validation/user.schema')
const validateRequest = require('../middleware/validateRequest')


route.put("/signup", validateRequest(userSchema), authController.singup);
route.post("/login", authController.login);

module.exports = route;
