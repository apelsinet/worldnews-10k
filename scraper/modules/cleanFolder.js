const fs = require('fs');
const rimraf = require('rimraf');

const cleanFolder = (dirpath) => {
  console.log('Rimraf: ' + dirpath);
  rimraf.sync(dirpath);
  console.log('Make dir: ' + dirpath);
  fs.mkdirSync(dirpath);
}

module.exports = cleanFolder;