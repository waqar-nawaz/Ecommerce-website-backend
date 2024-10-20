const cartModel = require("../models/cart.model");

exports.addCart = async (req, res, next) => {
  const { userId, productId, quantity } = req.body;
  let cart = await cartModel.findOne({ userId });

  if (!cart) {
    cart = await cartModel.create({ userId: userId, items: [] });
  }

  try {
    const product = cart.items.findIndex((items) => {
      return items.product.toString() == productId;
    });
    if (product > -1) {
      return res.status(200).json({ message: "Product Already in The Cart" });
    } else {
      cart.items.push({ product: productId, quantity: quantity });
    }

    await cart.save();
    return res
      .status(200)
      .json({ message: "Product added to cart successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getCart = async (req, res, next) => {
  const userId = req.params.userId;
  console.log(`Fetching cart for user: ${userId}`);

  try {
    // Find the cart for the given userId
    const cart = await cartModel
      .findOne({ userId })
      .populate({
        path: "items.product",
        select:
          "-reviews -category -ratings -imagePublicId -creater -createdAt -updatedAt -__v -sku",
      })
      .select("-__v");
    // If no cart is found, send a response indicating so
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Return the cart data if found
    return res.status(200).json({ message: "Cart fetched successfully", cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    next(error); // Pass error to the error-handling middleware
  }
};

exports.updateCart = async (req, res, next) => {
  const { userId, productId, quantity } = req.body;
  let cart = await cartModel.findOne({ userId });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const product = cart.items.findIndex((items) => {
    return items.product.toString() == productId;
  });

  if (quantity <= 0) {
    return res
      .status(200)
      .json({ message: "Quantity Must Be Positive Number" });
  }

  if (product > -1) {
    cart.items[product].quantity = quantity;
    await cart.save();
    return res.status(200).json({ message: "Cart updated successfully" });
  }

  return res.status(404).json({ message: "Product not found in the cart" });
};
exports.deleteCart = async (req, res, next) => {
  const { userId, productId } = req.body;

  let cart = await cartModel.findOne({ userId });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const itemIndex = cart.items.findIndex((item) => {
    return item.product.toString() === productId;
  });

  if (itemIndex > -1) {
    cart.items.splice(itemIndex, 1);
    await cart.save();
    return res.status(200).json({ message: "Cart Item deleted successfully" });
  }

  return res.status(404).json({ message: "Product not found in the cart" });
};
