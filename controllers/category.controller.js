const Category = require("../models/category.model");
const clearImage = require("../utils/clearImage");
const { uploadImage } = require("../utils/cloudinary");
const io = require("../socket.io");

exports.addCategory = async (req, res, next) => {
  const name = req.body.name;
  const file = req.file?.path;

  //   console.log(name);
  try {
    // Check if a file was uploaded
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Await the cloudinary upload result
    const uploadResult = await uploadImage(file, "Category");

    if (!uploadResult) {
      return res.status(500).json({ message: "Failed to upload image" });
    }

    const data = {
      name,
      imageUrl: uploadResult.url,
      imagePublicId: uploadResult.public_id,
    };

    const result = await Category.create(data);

    if (!result) {
      return res.status(500).json({ message: "Failed to create category" });
    }

    res.status(201).json({
      message: "Category created successfully",
      result,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategory = (req, res, next) => {
  Category.find()
    .then((result) => {
      res.status(200).json({
        message: "Category fetched successfully",
        result,
      });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getCategoryById = (req, res, next) => {
  const id = req.params.id;
  Category.findById(id)
    .then((result) => {
      res.status(200).json({
        message: "Category fetched successfully",
        result,
      });
    })
    .catch((error) => {
      next(error);
    });
};

exports.updateCategory = (req, res, next) => {
  const id = req.params.id;
  const name = req.body.name;
  const imageUrl = req.body.imageUrl;

  const data = {
    name,
    imageUrl,
  };

  Category.findByIdAndUpdate(id, data)
    .then((result) => {
      res.status(200).json({
        message: "Category updated successfully",
        result,
      });
    })
    .catch((error) => {
      next(error);
    });
};

exports.deleteCategory = (req, res, next) => {
  const id = req.params.id;

  Category.findByIdAndDelete(id)
    .then((result) => {
      res.status(200).json({
        message: "Category deleted successfully",
        result,
      });
    })
    .catch((error) => {
      next(error);
    });
};
