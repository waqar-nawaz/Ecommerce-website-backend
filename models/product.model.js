const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  imageUrl: { type: String },
  imagePublicId: {
    type: String,
    required: true,
  },
  category: { type: String, required: true }, // Reference to Category
  brand: { type: String, required: true }, // Reference to Brand
  sku: { type: String }, // Unique identifier for this product variant
  ratings: { type: Number, default: 0 },
  creater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User
      comment: { type: String },
      rating: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ProductModel", productSchema);
