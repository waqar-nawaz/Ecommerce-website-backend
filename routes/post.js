const express = require("express");
const route = express.Router();
const feedController = require("../controllers/post");
const prodcutController = require("../controllers/prodcut.controller");
const validation = require("../utils/Checkvalidation");
const isAuth = require("../middleware/is-auth");

route.post(
  "/post",
  isAuth,
  [
    validation("title", 3),
    validation("price", 2),
    validation("description", 5),
  ],
  feedController.createPost
);

route.put(
  "/post/:id",
  isAuth,
  [
    validation("title", 3),
    validation("price", 2),
    validation("description", 5),
  ],
  feedController.updatePost
);

route.delete("/post/:id", isAuth, feedController.deletePost);

route.get("/post/search", isAuth, feedController.postSearch);
route.get("/post/:id", feedController.getProductById);
route.get("/post", isAuth, feedController.getPost);
route.post("/product", isAuth, [
  validation("name", 2),
  validation("price", 2),
  validation("stock", 5),
  validation("brand", 2),
  validation("category", 5),
  validation("description", 5),

], prodcutController.addProduct);



module.exports = route;
