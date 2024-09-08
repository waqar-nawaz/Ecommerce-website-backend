const { body } = require("express-validator");

const validation = (id, len) => {
    return body(id)
        .trim()
        .notEmpty()
        .withMessage(`${id} is Required`)
        .isLength({ min: len })
        .withMessage(`${id} must be at least ${len} characters long`);
};

module.exports = validation;
