const express = require("express");
const route = express.Router();
const prodcutController = require("../controllers/prodcut.controller");
const isAuth = require("../middleware/is-auth");
const productsSchema = require("../validation.Schemas/products.schema");
const validateRequest = require("../middleware/validateRequest");


route.post("/", isAuth, validateRequest(productsSchema), prodcutController.addProduct);
route.get("/", prodcutController.getProduct);
route.get("/:id", prodcutController.getProductById);
route.put("/:id", isAuth, prodcutController.updateProduct);
route.delete("/:id", isAuth, prodcutController.deleteProduct);


module.exports = route;
