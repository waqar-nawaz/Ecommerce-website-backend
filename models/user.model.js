const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },

    post: [
      {
        type: Schema.Types.ObjectId,
        ref: "Products",
      },
    ],
    product: [
      {
        type: Schema.Types.ObjectId,
        ref: "ProductModel",
      },
    ],
    status: {
      type: String,
      default: "active",

      enum: ["active", "inactive"],

      required: true,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
