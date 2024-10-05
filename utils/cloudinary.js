const fs = require("fs");
const { v4: uuidv4 } = require("uuid"); // Use UUID for unique IDs
const cloudinary = require("./cloudinary-config");

// Cloudinary Upload Function
exports.uploadImage = async (imagePath, folder) => {
  try {
    const uniquePublicId = `${folder}_${uuidv4()}`; // Generate a unique ID for each image
    const uploadResult = await cloudinary.uploader.upload(imagePath, {
      public_id: uniquePublicId, // Use unique ID
      folder: folder,
      timeout: 60000,
      secure_url: true,
    });

    // Remove the local file after upload
    fs.unlinkSync(imagePath);

    // Return the upload result
    return { url: uploadResult.secure_url, public_id: uploadResult.public_id };
  } catch (error) {
    console.error("Cloudinary upload error:", error.message); // Log the specific error message
    console.error("Error details:", error); // Log additional error details if available
    fs.unlinkSync(imagePath);
    throw new Error("Image upload failed. Reason: " + error.message); // Return a clear error message
  }
};

// Cloudinary Delete Function
exports.deleteImage = async (publicId) => {
  // console.log(publicId);
  try {
    const deleteResult = await cloudinary.uploader.destroy(publicId);
    return deleteResult;
  } catch (error) {
    console.error("Cloudinary upload error:", error.message);
    throw new Error("Image deletion failed. Reason: " + error.message);
  }
};
