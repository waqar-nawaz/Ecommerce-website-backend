const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.singup = async (req, res, next) => {
  try {
    const { email, name, password, status } = req.body;

    const isEmail = await User.findOne({ email });
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

    delete result._doc["password"];
    delete result._doc["post"];
    delete result._doc["product"];
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

exports.updateUser = async (req, res, next) => {
  const { name, email, status, role } = req.body;
  const userId = req.params.userId;
  let data = {
    name,
    email,
    status,
    role,
  };
  const user = await User.findByIdAndUpdate(userId, data, { new: true });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  delete user._doc["password"];
  delete user._doc["post"];
  delete user._doc["product"];
  return res.status(200).json({ message: "User updated successfully", user });
};

exports.getUsers = async (req, res, next) => {
  const users = await User.find().select("-password -post -product");
  return res.status(200).json({ users });
};
