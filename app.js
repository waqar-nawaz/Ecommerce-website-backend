const express = require("express");
const app = express();
const routes = require("./routes/post");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
const upload = require("./utils/imageUpload");
const corse = require("./utils/cors");
const authroute = require("./routes/auth.route");
const productroute = require("./routes/product.route")

// CORS Headers Middleware
app.use(corse.corsFun);

// Body Parser Middleware - Should be applied before multer
app.use(bodyParser.json());

// Multer Middleware for handling file uploads
app.use(upload.single("imageUrl"));

// Routes
app.use("/api", productroute);
app.use("/feed", routes);
app.use("/auth", authroute);

// Static Files Middleware for serving images
app.use("/images", express.static(path.join(__dirname, "images")));

// Error Handling Middleware
app.use((error, req, res, next) => {
  res.status(500).json({ error: error?.message });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(process.env.PORT);
    console.log(`Server is running on port ${process.env.PORT}`);
  })
  .catch((err) => {
    console.log("Issue in Database Connection", err);
  });
