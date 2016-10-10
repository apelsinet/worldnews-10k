const fs = require('fs');
const Jimp = require('jimp');
const constants = require('../constants');
const fileExists = require('../fileExists');
const dev = process.env.NODE_ENV === 'development' ? true : false;

module.exports = (obj, fileName, i) => new Promise((resolveRoot, rejectRoot) => {
  
  const filePath = constants.IMG_DIR + fileName;

  new Promise((resolveBase64, rejectBase64) => {

    Jimp.read(filePath, (err, image) => {
      if (err) throw err;

      // old file with same hash does not exist
      if (!fileExists(constants.DIST_IMG_FULL + fileName)) {
        // write high res file
        image.resize(640, Jimp.AUTO)
          .quality(70)
          .write(constants.DIST_IMG_FULL + fileName);
        if (dev) console.log(i + '. High res version of image: ' + fileName + ' written.');
      }

      obj.imgFull = fileName;

      // encode base64 preview
      image.resize(16, Jimp.AUTO)
        .rgba(false)
        .deflateLevel(1)
        .getBase64(Jimp.MIME_PNG, (err, result) => {
          if (err) base64reject();
          obj.imgBase64 = result;
          if (dev) console.log(i + '. Base64 of image: ' + fileName + ' encoded.');
          resolveBase64();
        });
    });
  }).then(() => {
    // successfully compressed image
    if (dev) console.log(i + '. Image ' + fileName + ' complete.');
    resolveRoot(obj);
  }).catch(err => {
    console.log(i + '. Error compressing image ' + fileName + '.');
    console.log(err);
    rejectRoot(obj);
  });
})

