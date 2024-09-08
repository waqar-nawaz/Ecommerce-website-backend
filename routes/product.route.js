
const express = require('express');
const route = express.Router();
const prodcutController = require("../controllers/prodcut.controller");
const validation = require("../utils/Checkvalidation");
const isAuth = require("../middleware/is-auth");



route.post("/product", isAuth, [
    validation("name", 2),
    validation("price", 1),
    validation("stock", 1),
    validation("brand", 2),
    validation("category", 3),
    validation("description", 5),

], prodcutController.addProduct);
route.get("/product", prodcutController.getProduct);




module.exports = route
