const express = require("express");
const app = express();
const route = express.Router();
const prodcutController = require("../controllers/prodcut.controller");
const isAuth = require("../middleware/is-auth");
const productsSchema = require("../validation.Schemas/products.schema");
const validateRequest = require("../middleware/validateRequest");
const categoryController = require("../controllers/category.controller");

route.post(
  "/product",
  isAuth,
  validateRequest(productsSchema),
  prodcutController.addProduct
);
route.get("/product", prodcutController.getProduct);
route.get("/product/:id", prodcutController.getProductById);
route.put("/product/:id", isAuth, prodcutController.updateProduct);
route.delete("/product/:id", isAuth, prodcutController.deleteProduct);

// category routes
route.post("/category", isAuth, categoryController.addCategory);
route.get("/category", categoryController.getCategory);
route.get("/category/:id", categoryController.getCategoryById);
route.put("/category/:id", isAuth, categoryController.updateCategory);
route.delete("/category/:id", isAuth, categoryController.deleteCategory);

module.exports = route;
