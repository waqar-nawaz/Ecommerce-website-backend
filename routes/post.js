const express = require("express");
const route = express.Router();
const postController = require("../controllers/post");
const prodcutController = require("../controllers/prodcut.controller");
const isAuth = require("../middleware/is-auth");
const validateRequest = require("../middleware/validateRequest");
const productSchema = require("../validation.Schemas/product.shcema");

route.post(
  "/post",
  isAuth,
  validateRequest(productSchema),
  postController.createPost
);
route.put("/post/:id", isAuth, postController.updatePost);
route.delete("/post/:id", isAuth, postController.deletePost);
route.get("/post/search", isAuth, postController.postSearch);
route.get("/post/:id", postController.getPostById);
route.get("/post", isAuth, postController.getPost);

module.exports = route;
