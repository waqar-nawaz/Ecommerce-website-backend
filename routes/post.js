const express = require("express");
const route = express.Router();
const feedController = require("../controllers/post");
const prodcutController = require("../controllers/prodcut.controller");
const isAuth = require("../middleware/is-auth");
const validateRequest = require("../middleware/validateRequest");
const productSchema = require("../validation.Schemas/product.shcema");

route.post(
  "/post",
  isAuth,
  validateRequest(productSchema),
  feedController.createPost
);
route.put("/post/:id", isAuth, feedController.updatePost);
route.delete("/post/:id", isAuth, feedController.deletePost);
route.get("/post/search", isAuth, feedController.postSearch);
route.get("/post/:id", feedController.getProductById);
route.get("/post", isAuth, feedController.getPost);
route.post("/product", isAuth, prodcutController.addProduct);

module.exports = route;
