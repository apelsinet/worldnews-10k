const fs = require('fs');

const fileExists = (filePath) => {
  try {
    fs.accessSync(filePath, fs.constants.F_OK)
  }catch (err) {
    return false;
  }
  return true;
}

module.exports = fileExists;
