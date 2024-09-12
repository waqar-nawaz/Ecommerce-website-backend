
const express = require('express');
const route = express.Router();
const prodcutController = require("../controllers/prodcut.controller");
const isAuth = require("../middleware/is-auth");
const productsSchema = require('../validation/products.schema');
const validateRequest = require('../middleware/validateRequest');





route.post("/product", isAuth, validateRequest(productsSchema), prodcutController.addProduct);
route.get("/product", isAuth, prodcutController.getProduct);




module.exports = route
