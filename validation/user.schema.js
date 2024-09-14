const Joi = require('joi');

const userSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'string.empty': 'Email is required',
        }),

    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Password should have at least 6 characters',
            'string.empty': 'Password is required',
        }),

    name: Joi.string()
        .min(3)
        .required()
        .messages({
            'string.min': 'Name should have at least 3 characters',
            'string.empty': 'Name is required',
        }),

    post: Joi.array().items(
        Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .messages({
                'string.pattern.base': 'Invalid post ID format',
            })
    ).optional(),

    product: Joi.array().items(
        Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .messages({
                'string.pattern.base': 'Invalid product ID format',
            })
    ).optional(),

    status: Joi.string()
        .valid('active', 'inactive')
        .default('active')
        .required()
        .messages({
            'any.only': 'Status must be either active or inactive',
            'string.empty': 'Status is required',
        }).optional(),

    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional(),
});

module.exports = userSchema;