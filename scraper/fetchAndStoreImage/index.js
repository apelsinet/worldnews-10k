const fetch = require('node-fetch');
const fs = require('fs');
const hashString = require('../hashString');
const fileExists = require('../fileExists');
const writeImage = require('../writeImage');
const constants = require('../constants');
const dev = process.env.NODE_ENV === 'development' ? true : false;

const imageExistsOnFs = (fileName) => {
  if (fileExists(constants.IMG_DIR + fileName + '.jpg')) return true;
  else return false;
}

const fetchImage = (url, id) => new Promise((resolve, reject) => {
  if (url === '') reject();
  else {
    fetch(url).then(res => {
      return res.buffer();
    }).then(buffer => {
      if (dev) console.log(id + '. Fetched image from: ' + url + '.');
      resolve(buffer);
    }).catch((err) => {
      console.error(new Error(id + '. Node-fetch could not fetch image from: ' + url));
      reject(err);
    });
  }
});

const useGenericImage = (id) => {
  const genericHash = '6d0be561ab';
  if (!imageExistsOnFs(genericHash)) {
    fs.writeFileSync(constants.IMG_DIR + genericHash + '.jpg', fs.readFileSync('./dist/generic.jpg'));
  }
  if (dev) console.log(id + '. Using generic image.');
  return genericHash;
}

module.exports = (url, id) => new Promise((resolve, reject) => {
  if (typeof url !== 'string') reject(new TypeError('Argument url is not a string.'));

  const hashedUrl = hashString(url);
  module.exports.hashedUrl = hashedUrl;

  if (!imageExistsOnFs(hashedUrl)) {
    fetchImage(url, id).then(buffer => {
      writeImage(buffer, hashedUrl, id).then(() => {
        resolve(hashedUrl + '.jpg');
      }).catch(() => {
        // could not write image, using generic
        resolve(useGenericImage(id) + '.jpg');
      });
    }).catch(() => {
      // could not fetch image, using generic
      resolve(useGenericImage(id) + '.jpg');
    });
  }

  else {
    if (dev) console.log(id + '. Image already on fs.');
    resolve(hashedUrl + '.jpg');
  }

});

module.exports.imageExistsOnFs = imageExistsOnFs;
module.exports.fetchImage = fetchImage;

