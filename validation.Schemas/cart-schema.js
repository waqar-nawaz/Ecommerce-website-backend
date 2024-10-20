const Joi = require("joi");
const mongoose = require("mongoose");

const cartSchema = Joi.object({
  userId: Joi.string()

    .required()
    .messages({
      "any.required": "User ID is required",
      "string.base": "User ID must be a string",
    }),
  productId: Joi.string()

    .required()
    .messages({
      "any.required": "Product ID is required",
      "string.base": "Product ID must be a string",
    }),
  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "Quantity must be a number",
    "number.integer": "Quantity must be an integer",
    "number.min": "Quantity must be at least 1",
    "any.required": "Quantity is required",
  }),
});

module.exports = cartSchema;
