const fs = require('fs');
const Jimp = require('jimp');
const constants = require('../constants');
const fileExists = require('../fileExists');
const dev = process.env.NODE_ENV === 'development' ? true : false;

const processImage = (article) => new Promise((resolve, reject) => {

  const srcFilePath = constants.IMG_DIR + article.imgFileName;
  const destFilePath = constants.DIST_IMG_FULL + article.imgFileName;

  // old file with same hash does not exist, or base64 is not cached
  if (!fileExists(destFilePath) || article.imgBase64 === undefined) {

    Jimp.read(srcFilePath, (err, image) => {
      if (err) reject(err);

      if (!fileExists(destFilePath)) {
        // write high res file
        image.resize(640, Jimp.AUTO)
          .quality(70)
          .write(destFilePath);
        if (dev) console.log(article.id + '. High res version of image: ' + article.imgFileName + ' written.');
      }

      // encode base64 preview
      image.resize(16, Jimp.AUTO)
        .rgba(false)
        .deflateLevel(1)
        .getBase64(Jimp.MIME_PNG, (err, result) => {
          if (err) reject(err);
          if (dev) console.log(article.id + '. Base64 of image: ' + article.imgFileName + ' encoded.');
          resolve(result);
        });
    });
  }
  else {
    if (dev) console.log(article.id + '. Image and Base64 loaded from cache.');
    resolve(article.imgBase64);
  }

});

module.exports = (article) => new Promise((resolve, reject) => {

  processImage(article).then((base64) => {
    const imgBase64 = {imgBase64: base64};
    // successfully compressed image
    if (dev) console.log(article.id + '. Image ' + article.imgFileName + ' processed.');
    resolve(Object.assign({}, article, imgBase64));
  }).catch(err => {
    console.error(article.id + '. Error processing image ' + article.imgFileName + '.');
    reject(err);
  });
})

