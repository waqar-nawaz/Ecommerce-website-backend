const express = require("express");
const route = express.Router();
const prodcutController = require("../controllers/prodcut.controller");
const isAuth = require("../middleware/is-auth");
const productsSchema = require("../validation.Schemas/products.schema");
const validateRequest = require("../middleware/validateRequest");

route.post(
  "/product",
  isAuth,
  validateRequest(productsSchema),
  prodcutController.addProduct
);
route.get("/product", prodcutController.getProduct);
route.get("/product/:id", prodcutController.getProductById);

module.exports = route;
