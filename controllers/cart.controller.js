const cartModel = require("../models/cart.model");

const User = require("../models/user.model");

exports.addCart = async (req, res, next) => {
  const { totalPrice, items } = req.body;
  const data = {
    totalPrice,
    items,
    user: req.userId,
  };
  try {
    const result = await cartModel.create(data);
    if (!result) {
      return res.status(500).json({ message: "Failed to create cart" });
    }
    res.status(200).json({
      message: "Cart created successfully",
      result,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCart = async (req, res, next) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const result = await cartModel
      .find({ user: userId, status: "Pending" })
      .populate({
        path: "items",
        populate: {
          path: "product",
        },
      });
    if (!result) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json({
      message: "Cart fetched successfully",
      result,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCateCart = (req, res, next) => {
  // Logic for getting cart by ID
};
exports.updateCart = (req, res, next) => {
  // Logic for updating cart
};
exports.deleteCart = (req, res, next) => {
  // Logic for deleting cart
};
