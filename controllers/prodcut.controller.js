const product = require("../models/product.model");
const User = require("../models/user.model");
const clearImage = require("../utils/clearImage");

exports.addProduct = async (req, res, next) => {
  try {
    const { name, price, description, stock, brand, category, sku } = req.body;

    let file = req.file?.path;

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

    const prodcut = await product.create(data);
    const user = await User.findById(req.userId);

    if (prodcut && user) {
      user.product.push(prodcut);
      await user.save();
      return res
        .status(201)
        .json({ message: "Prodcut Create Successfully", result: prodcut });
    } else {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const result = await product.find();
    return res.status(200).json({ result });
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
      clearImage(post.imageUrl);
      return res.status(200).json({ message: "Product deleted successfully" });
    })
    .catch((err) => {
      next(err);
      console.log(err);
    });
};
