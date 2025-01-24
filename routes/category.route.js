const express = require("express");
const route = express.Router();
const isAuth = require("../middleware/is-auth");
const categoryController = require("../controllers/category.controller");



// category routes
route.post("/", isAuth, categoryController.addCategory);
route.get("/", categoryController.getCategory);
route.get("/:id", categoryController.getCategoryById);
route.put("/:id", isAuth, categoryController.updateCategory);
route.delete("/:id", isAuth, categoryController.deleteCategory);


module.exports = route;