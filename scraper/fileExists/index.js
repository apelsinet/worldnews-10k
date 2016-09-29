const fs = require('fs');

module.exports = (path) => {
  try {
    fs.accessSync(path, fs.constants.F_OK)
  } catch (err) {
    return false;
  }
  return true;
}

