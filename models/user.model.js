const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    googleId: {
      type: String,
      // required: true,
      unique: true, // Ensure each Google ID is unique
    },
    password: {
      type: String,
      // required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "user",

      enum: ["admin", "user"],
    },

    post: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
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
