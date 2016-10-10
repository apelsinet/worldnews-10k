const fetch = require('node-fetch');
const hashString = require('../hashString');
const fileExists = require('../fileExists');
const constants = require('../constants');

const imageExistsOnFs = (fileName) => {
  if (fileExists(constants.IMG_DIR + fileName + '.jpg')) return true;
  return false;
}
const fetchImage = (url) => new Promise((fetchImageResolve, fetchImageReject) => {
  if (url === '') fetchImageReject(false);
  else {
    fetch(url).then(res => {
      return res.buffer();
    }).then(buffer => {
      fetchImageResolve(buffer);
    }).catch(err => {
      console.error(new Error('node-fetch could not fetch image from: ' + url));
      fetchImageReject(false);
    });
  }
});

module.exports = (url) => new Promise((rootResolve, rootReject) => {
  if (typeof url !== 'string') rootReject(new TypeError('Argument url is not a string.'));

  const hashedUrl = hashString(url);
  module.exports.hashedUrl = hashedUrl;

  if (!imageExistsOnFs(hashedUrl)) {

  }

  rootResolve(constants.IMG_DIR + hashedUrl + '.jpg');

});
module.exports.imageExistsOnFs = imageExistsOnFs;
module.exports.fetchImage = fetchImage;
