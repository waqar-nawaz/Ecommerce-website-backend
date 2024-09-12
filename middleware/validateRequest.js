const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const validationErrors = error.details.map(err => err.message); // Gather all validation error messages
            return res.status(400).json({ message: "Validation failed", errors: validationErrors });
        }

        next(); // If validation passes, proceed to the next middleware/controller
    };
};

module.exports = validateRequest;