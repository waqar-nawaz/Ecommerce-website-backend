// import { v2 as cloudinary } from "cloudinary";
// require("dotenv").config();
// const fs = require("fs");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const fs = require("fs");

exports.cloudinary = async (imagePath) => {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const uploadResult = await cloudinary.uploader
      .upload(imagePath, {
        public_id: "product",
      })
      .catch((error) => {
        console.log(error);
      });

    // console.log("cloudinary image", uploadResult);
    return uploadResult.secure_url;
  } catch (error) {
    console.log(error);
    fs.unlinkSync(imagePath);
  }
};
