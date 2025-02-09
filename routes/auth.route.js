const express = require("express");
const route = express.Router();
const authController = require("../controllers/auth.controller");
const userSchema = require("../validation.Schemas/user.schema");
const validateRequest = require("../middleware/validateRequest");

route.put("/signup", validateRequest(userSchema), authController.singup);
route.post("/login", authController.login);
route.get("/user", authController.getUsers);
route.put("/user/:userId", authController.updateUser);
route.delete("/user/:userId", authController.deleteUser);
route.post("/google", authController.googleLogin);


module.exports = route;
