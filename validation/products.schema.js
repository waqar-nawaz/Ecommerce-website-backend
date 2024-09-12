const Joi = require('joi');

const productsSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .required()
        .messages({
            'string.empty': 'Product name is required',
            'string.min': 'Product name should have at least 3 characters',
        }),

    description: Joi.string()
        .min(10)
        .required()
        .messages({
            'string.empty': 'Description is required',
            'string.min': 'Description should have at least 10 characters',
        }),

    price: Joi.number()
        .positive()
        .required()
        .messages({
            'number.base': 'Price must be a number',
            'number.positive': 'Price must be a positive number',
            'any.required': 'Price is required',
        }),

    stock: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            'number.base': 'Stock must be a number',
            'number.min': 'Stock cannot be negative',
            'any.required': 'Stock is required',
        }),



    category: Joi.string()
        .required()
        .messages({
            'string.empty': 'Category is required',
        }),

    brand: Joi.string()
        .required()
        .messages({
            'string.empty': 'Brand is required',
        }),

    sku: Joi.string()
        .optional(),



    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional(),
});

module.exports = productsSchema;
