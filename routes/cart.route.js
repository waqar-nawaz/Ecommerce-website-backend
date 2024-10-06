const express = require("express");
const app = express();
const route = express.Router();
const cartController = require("../controllers/cart.controller");
const isAuth = require("../middleware/is-auth");
const cartsSchema = require("../validation.Schemas/cart-schema");
const validateRequest = require("../middleware/validateRequest");

// category routes
route.post("/", isAuth, validateRequest(cartsSchema), cartController.addCart);
route.get("/", isAuth, cartController.getCart);
route.get("/:id", cartController.getCateCart);
route.put("/:id", isAuth, cartController.updateCart);
route.delete("/:id", isAuth, cartController.deleteCart);

module.exports = route;
