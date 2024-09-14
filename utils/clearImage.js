const fs = require("fs");
const path = require("path");

const clearImage = (filePath) => {
  // Check if the file exists
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) throw err;
    });
  } else {
  }
};

module.exports = clearImage;
