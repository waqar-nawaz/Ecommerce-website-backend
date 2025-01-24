const express = require("express");
const route = express.Router();
const postController = require("../controllers/post");
const isAuth = require("../middleware/is-auth");
const validateRequest = require("../middleware/validateRequest");
const postSchema = require("../validation.Schemas/post.shcema");

route.post("/", isAuth, validateRequest(postSchema), postController.createPost);
route.put("/:id", isAuth, postController.updatePost);
route.delete("/:id", isAuth, postController.deletePost);
route.get("/search", isAuth, postController.postSearch);
route.get("/:id", postController.getPostById);
route.get("/", isAuth, postController.getPost);

module.exports = route;
