const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.singup = async (req, res, next) => {
  try {
    const { email, name, password, status } = req.body;

    const isEmail = User.findOne({ email });
    if (isEmail) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      name,
      email,
      password: hashedPassword,
      status,
    });
    return res
      .status(201)
      .json({ message: "User created successfully", result });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    } else {
      next(error);
    }
  }
};

exports.login = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ message: error.array()[0].msg });
  }
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    let token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    delete user._doc["password"];
    return res.status(200).json({ message: "Login successfully", user, token });
  } catch (error) {
    next(error);
  }
};
