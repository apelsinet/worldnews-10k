const fetch = require('node-fetch');
const fs = require('fs');
const hashString = require('../hashString');
const fileExists = require('../fileExists');
const writeImage = require('../writeImage');
const constants = require('../constants');
const dev = process.env.NODE_ENV === 'development' ? true : false;

const imageExistsOnFs = (fileName) => {
  if (fileExists(constants.IMG_DIR + fileName + '.jpg')) return true;
  return false;
}

const fetchImage = (url, i) => new Promise((fetchImageResolve, fetchImageReject) => {
  if (url === '') fetchImageReject();
  else {
    fetch(url).then(res => {
      return res.buffer();
    }).then(buffer => {
      if (dev) console.log(i + '. Fetched image from: ' + url + '.');
      fetchImageResolve(buffer);
    }).catch(() => {
      console.error(new Error(i + '. Node-fetch could not fetch image from: ' + url));
      fetchImageReject();
    });
  }
});

const useGenericImage = (i) => {
  const genericHash = '6d0be561ab7b1bec054bcf6f747b3592';
  if (!imageExistsOnFs(genericHash)) {
    fs.writeFileSync(constants.IMG_DIR + genericHash + '.jpg', fs.readFileSync('./dist/generic.jpg'));
  }
  if (dev) console.log(i + '. Using generic image.');
  return genericHash;
}

module.exports = (url, i) => new Promise((rootResolve, rootReject) => {
  if (typeof url !== 'string') rootReject(new TypeError('Argument url is not a string.'));

  const hashedUrl = hashString(url);
  module.exports.hashedUrl = hashedUrl;

  if (!imageExistsOnFs(hashedUrl)) {
    fetchImage(url, i).then(buffer => {
      writeImage(buffer, hashedUrl, i).then(() => {
        rootResolve(hashedUrl + '.jpg');
      }).catch(() => {
        // could not write image, using generic
        rootResolve(useGenericImage(i) + '.jpg');
      });
    }).catch(() => {
      // could not fetch image, using generic
      rootResolve(useGenericImage(i) + '.jpg');
    });
  }

  else {
    if (dev) console.log(i + '. Image from: ' + url + ' already on fs.');
    rootResolve(hashedUrl + '.jpg');
  }

});
module.exports.imageExistsOnFs = imageExistsOnFs;
module.exports.fetchImage = fetchImage;
