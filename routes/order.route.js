const express = require("express");
const route = express.Router();
const orderController = require("../controllers/order.controller");
const isAuth = require("../middleware/is-auth");
// const cartsSchema = require("../validation.Schemas/cart-schema");
const validateRequest = require("../middleware/validateRequest");

// category routes
route.post("/", isAuth, orderController.addOrder);
route.get("/", isAuth, orderController.getOrders);

module.exports = route;
