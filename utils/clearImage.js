const fs = require("fs");
const path = require("path");

const clearImage = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
    // console.log('File deleted!');
  });
};

module.exports = clearImage;
