const express = require("express");
const route = express.Router();
const cartController = require("../controllers/cart.controller");
const isAuth = require("../middleware/is-auth");
const cartsSchema = require("../validation.Schemas/cart-schema");
const validateRequest = require("../middleware/validateRequest");

// category routes
route.post("/", isAuth, validateRequest(cartsSchema), cartController.addCart);
route.get("/:userId", isAuth, cartController.getCart);
route.put("/", isAuth, cartController.updateCart);
route.delete("/", isAuth, cartController.deleteCart);

module.exports = route;
