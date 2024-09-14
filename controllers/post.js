const fs = require("fs");
const path = require("path");
const fullpath = path.join(__dirname, "../data.json");
const product = require("../models/products.model");
const clearImage = require("../utils/clearImage");
const paginate = require("../utils/generic.pagination");
const user = require("../models/user.model");

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

    // Validate the request body (this will already be done by the middleware)
    let data = {
      title,
      price,
      imageUrl: file,
      description,
      userId: req.userId,
    };

    // Create the product
    const post = await product.create(data);

    // Find the user and push the product ID (Mongoose automatically stores just the reference)
    const user = await user.findById(req.userId);
    user.post.push(post._id); // Push only the post's ID, not the whole object
    await user.save();

    // Respond with success
    return res
      .status(201)
      .json({ message: "Product created successfully", data });
  } catch (error) {
    next(error); // Pass errors to the global error handler
  }
};

// Product update operations
exports.updatePost = (req, res, next) => {
  const { title, price, description } = req.body;
  let file = req.file ? req.file.path : req.body.imageUrl;
  let data = { title, price, imageUrl: file, description };
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const id = req.params.id;
  product
    .findById(id)
    .then((post) => {
      if (!post) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (req.file) {
        clearImage(post.imageUrl);
      }
    })
    .catch((err) => {
      next(err);
    });

  product
    .findByIdAndUpdate(id, data, { new: true })
    .then((data) => {
      if (!data) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res
        .status(200)
        .json({ message: "Product updated successfully", data: data });
    })
    .catch((err) => {
      next(err);
    });
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
      clearImage(post.imageUrl);
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
  console.log(id);

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
