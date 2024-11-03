const Order = require("../models/order.model");
const Cart = require("../models/cart.model");

exports.addOrder = async (req, res, next) => {
  const { subtotal, tax, grandTotal } = req.body;

  try {
    if (!subtotal || !tax || !grandTotal) {
      return res
        .status(400)
        .json({ message: "Missing subtotal, tax, or grandTotal" });
    }

    const cart = await Cart.findOne({ userId: req.userId }).populate(
      "items.product"
    );

    const data = {
      userId: req.userId,
      items: cart.items,
      subtotal: subtotal,
      tax: tax,
      grandTotal: grandTotal,
    };

    const order = await Order.create(data);

    if (!order) {
      return res.status(500).json({ message: "Failed to create order" });
    }

    // Clear the cart
    await Cart.findOneAndUpdate({ userId: req.userId }, { items: [] });

    return res
      .status(201)
      .json({ message: "Order created successfully", order });
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  const userId = req.userId;

  try {
    const order = await Order.findOne({ userId })
      .populate({
        path: "items.product", // Populate the `product` field in each item
        select: "name description price stock imageUrl brand -_id", // Specify fields to select from `Product`
      })
      .select("-items._id");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Orders fetched successfully", order });
  } catch (error) {
    next(error);
  }
};
