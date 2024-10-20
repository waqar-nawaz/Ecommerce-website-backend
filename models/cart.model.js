const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "ProductModel",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1, // Ensure quantity is always at least 1
  },
  _id: false, // Remove the default "_id" field that Mongoose adds
});

const CartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Ensure one cart per user
    },
    items: [CartItemSchema],
  },
  {
    timestamps: true, // Automatically create `createdAt` and `updatedAt` fields
  }
);

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
