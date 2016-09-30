const fs = require('fs');
const rimraf = require('rimraf');
const dev = process.env.NODE_ENV === 'development' ? true : false;

const cleanFolder = (dirpath) => {
  if (dev) console.log('Rimraf: ' + dirpath);
  rimraf.sync(dirpath);
  if (dev) console.log('Make dir: ' + dirpath + '\n');
  fs.mkdirSync(dirpath);
}

module.exports = cleanFolder;
