const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid"); // Use UUID for unique IDs

// Cloudinary Upload Function
exports.uploadImage = async (imagePath, folder) => {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const uniquePublicId = `product_${uuidv4()}`; // Generate a unique ID for each image

    const uploadResult = await cloudinary.uploader.upload(imagePath, {
      public_id: uniquePublicId, // Use unique ID
      folder: folder,
    });

    // Remove the local file after upload
    fs.unlinkSync(imagePath);
    // console.log("Image URL from Cloudinary:", uploadResult);

    // Return the secure URL of the uploaded image and its public ID for future deletion
    return { url: uploadResult.secure_url, public_id: uploadResult.public_id };
  } catch (error) {
    console.log(error);
    fs.unlinkSync(imagePath); // Ensure file is deleted even in case of an error
    throw new Error("Image upload failed");
  }
};

// Cloudinary Delete Function
exports.deleteImage = async (publicId) => {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const deleteResult = await cloudinary.uploader.destroy(publicId);
    return deleteResult;
  } catch (error) {
    throw new Error("Image deletion failed");
  }
};
