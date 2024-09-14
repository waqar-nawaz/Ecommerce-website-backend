const fs = require("fs");
const path = require("path");

const clearImage = (filePath) => {
  // Check if the file exists
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) throw err;
      console.log("File deleted successfully!");
    });
  } else {
    console.log("File does not exist at the given path.");
  }
};

module.exports = clearImage;
