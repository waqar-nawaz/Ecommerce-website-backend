const fs = require("fs");
const path = require("path");
const product = require("../models/products.model");
const clearImage = require("../utils/clearImage");
const paginate = require("../utils/generic.pagination");
const User = require("../models/user.model");
const io = require("../socket.io");
const { uploadImage, deleteImage } = require("../utils/cloudinary");

exports.getPost = async (req, res, next) => {
  try {
    const currentPage = parseInt(req.query.currentPage) || 1;
    const perPage = parseInt(req.query.perPage) || 10; // Default items per page

    const totalItems = await product.countDocuments();
    // Get pagination details
    const pagination = paginate({ currentPage, perPage, totalItems });

    // Fetch paginated data
    const data = await product
      .find()
      .populate({
        path: "userId", // Field to populate
        select: "-password -post -__v",
      })
      .skip(pagination.skip)
      .limit(pagination.perPage);

    // const result = await product.find().userId == req.userId

    // Send response with paginated results
    res.status(200).json({
      message: "Fetch successfully",
      result: data,
      ...pagination,
    });
  } catch (err) {
    // Pass error to the next middleware
    next(err);
  }
};

// Product creation function
exports.createPost = async (req, res, next) => {
  try {
    const { title, price, description } = req.body;
    const file = req.file?.path;

    // Check if a file was uploaded
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Await the cloudinary upload result
    const uploadResult = await uploadImage(file);

    // Log the image URL from the upload result
    // console.log("Image URL Here", uploadResult.secure_url);

    if (!uploadResult) {
      return res.status(500).json({ message: "Failed to upload image" });
    }

    // Validate the request body (this will already be done by the middleware)
    let data = {
      title,
      price,
      imageUrl: uploadResult.url,
      imagePublicId: uploadResult.public_id,
      description,
      userId: req.userId,
    };

    // Create the product
    const post = await product.create(data);
    // Find the user and push the product ID (Mongoose automatically stores just the reference)
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.post.push(post._id); // Push only the post's ID, not the whole object
    await user.save();

    // Emit the event to all connected clients
    io.getIO().emit("posts", { action: "create", result: post });

    // Respond with success
    return res
      .status(201)
      .json({ message: "Product created successfully", result: post });
  } catch (error) {
    console.log(error);
    next(error); // Pass errors to the global error handler
  }
};

// Product update operations
exports.updatePost = async (req, res, next) => {
  try {
    let { title, price, description, imagePublicId } = req.body;
    let file = req.file ? req.file.path : req.body.imageUrl;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (req.file) {
      const uploadResult = await uploadImage(file);
      imagePublicId = uploadResult.public_id;
      file = uploadResult.url;
    }

    const id = req.params.id;
    const post = await product.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (req.file) {
      await deleteImage(post.imagePublicId);
    }

    const data = { title, price, imageUrl: file, description, imagePublicId };
    const updatedPost = await product.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!updatedPost) {
      return res.status(404).json({ message: "Product not found" });
    }

    io.getIO().emit("posts", { action: "update", result: updatedPost });

    return res
      .status(200)
      .json({ message: "Product updated successfully", result: updatedPost });
  } catch (err) {
    next(err);
  }
};

// product Delete Operation
exports.deletePost = async (req, res, next) => {
  const id = req.params.id;

  product
    .findByIdAndDelete(id)
    .then((post) => {
      if (!post) {
        throw new Error("Product not found");
      }
      return post;
    })
    .then((post) => {
      io.getIO().emit("posts", { action: "delete", result: post });

      clearImage(post.imageUrl);
      deleteImage(post.imagePublicId);

      return res.status(200).json({ message: "Product deleted successfully" });
    })
    .catch((err) => {
      next(err);
    });
};

//find search by name
exports.postSearch = async (req, res, next) => {
  const name = req.query.search.trim();
  let result;
  if (!name) {
    result = await product.find();
  }

  try {
    const result = await product.find({
      $or: [
        { title: { $regex: name, $options: "i" } },
        { description: { $regex: name, $options: "i" } },
      ],
    });

    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  const id = req.params.id;
  // console.log(id);

  try {
    const result = await product.findById(id);
    if (!result) {
      throw new Error("Product not found");
    }

    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};
