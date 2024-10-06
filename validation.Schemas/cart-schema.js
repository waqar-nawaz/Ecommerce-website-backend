const Joi = require("joi");
const mongoose = require("mongoose");

// Joi schema for cart items
const cartItemSchema = Joi.object({
  product: Joi.string()
    .custom((value, helpers) => {
      // Check if the product ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid product ID");
      }
      return value;
    })
    .required(),
  quantity: Joi.number().min(1).required(),
  price: Joi.number().required(),
  total: Joi.number().required(),
});

// Joi schema for the cart
const cartSchema = Joi.object({
  user: Joi.string()
    .custom((value, helpers) => {
      // Check if the user ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid user ID");
      }
      return value;
    })
    .required(),
  items: Joi.array().items(cartItemSchema).min(1).required(),
  totalPrice: Joi.number().required(),
});

module.exports = cartSchema;
