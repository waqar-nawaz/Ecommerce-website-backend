const express = require("express");
const app = express();
const routes = require("./routes/post");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
const upload = require("./utils/imageUpload");
const cors = require("cors");
const authroute = require("./routes/auth.route");
const productroute = require("./routes/product.route");

const socket = require("./socket.io");

// CORS Middleware
app.use(cors());
app.options("*", cors()); // Handle preflight CORS requests

// Multer Middleware for handling file uploads (put this before bodyParser)
app.use(upload.single("imageUrl"));

// Body Parser Middleware
app.use(bodyParser.json());

// Routes
app.use("/api", productroute);
app.use("/feed", routes);
app.use("/auth", authroute);

// Static Files Middleware
app.use("/images", express.static(path.join(__dirname, "images")));

// Error Handling Middleware
app.use((error, req, res, next) => {
  res.status(500).json({ error: error?.message });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    const server = app.listen(process.env.PORT);
    const io = require("./socket.io").init(server);

    io.on("connection", (socket) => {
      // console.log("Client Connected", socket.id);
    });

    //

    console.log(`Server is running on port ${process.env.PORT}`);
  })
  .catch((err) => {
    console.log("Issue in Database Connection", err);
  });
