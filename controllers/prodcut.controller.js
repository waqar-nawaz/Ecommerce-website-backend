const product = require("../models/product.model");
const User = require("../models/user.model");
const clearImage = require("../utils/clearImage");
const { uploadImage, deleteImage } = require("../utils/cloudinary");
const io = require("../socket.io");

exports.addProduct = async (req, res, next) => {
  try {
    const { name, price, description, stock, brand, category, sku } = req.body;
    const file = req.file?.path;

    // Check if a file was uploaded
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Await the cloudinary upload result
    const uploadResult = await uploadImage(file, "Product");

    if (!uploadResult) {
      return res.status(500).json({ message: "Failed to upload image" });
    }

    let data = {
      name,
      price,
      imageUrl: uploadResult.url,
      imagePublicId: uploadResult.public_id,
      description,
      stock,
      brand,
      category,
      creater: req.userId,
      sku,
    };
    // Create the product
    const prodcut = await product.create(data);

    // Find the user and push the product ID (Mongoose automatically stores just the reference)
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.product.push(prodcut);
    await user.save();

    // Emit the event to all connected clients
    io.getIO().emit("product", { action: "create", result: prodcut });

    //Response
    return res
      .status(201)
      .json({ message: "Prodcut Create Successfully", result: prodcut });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  const id = req.query.categoryId;

  try {
    const result = await product
      .find({ category: id })
      .select("-imagePublicId -__v")
      .populate({
        path: "creater category", // Field to populate
        select: "-post -password -product -createdAt -updatedAt -__v",
      });
    return res.status(200).json({ message: "Fetch successfully", result });
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  const id = req.params.id;

  try {
    const result = await product.findById(id).populate({
      path: "category",
    });
    if (!result) {
      throw new Error("Product not found");
    }

    res.status(200).json({ message: "Fetch successfully", result });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { name, price, description, stock, brand, category, sku } = req.body;

    let file = req.file?.path ?? req.body.imageUrl;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let data = {
      name,
      price,
      imageUrl: file,
      description,
      stock,
      brand,
      category,
      creater: req.userId,
      sku,
    };

    const id = req.params.id;
    const result = await product.findByIdAndUpdate(id, data, { new: true });

    if (!result) {
      throw new Error("Product not found");
    }

    return res
      .status(201)
      .json({ message: "Product Update Successfully", result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
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
      // console.log(post.imagePublicId);
      deleteImage(post.imagePublicId);
      return res.status(200).json({ message: "Product deleted successfully" });
    })
    .catch((err) => {
      next(err);
      console.log(err);
    });
};
