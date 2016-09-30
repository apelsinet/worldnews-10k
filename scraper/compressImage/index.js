const fs = require('fs');
const Jimp = require('jimp');
const constants = require('../constants');
const fileExists = require('../fileExists');
const dev = process.env.NODE_ENV === 'development' ? true : false;

module.exports = (obj, i) => new Promise((resolveRoot, rejectRoot) => {

  new Promise((resolveBase64, rejectBase64) => {

    Jimp.read(constants.IMG_DIR + i + '.jpg', (err, image) => {
      if (err) throw err;

      // clean up old file
      if (fileExists(constants.DIST_IMG_FULL + i + '.jpg')) {
        fs.unlinkSync(constants.DIST_IMG_FULL + i + '.jpg');
      }

      // write high res file
      image.resize(640, Jimp.AUTO)
        .quality(70)
        .write(constants.DIST_IMG_FULL + i + '.jpg');
      if (dev) console.log('High res version of image: ' + i + ' written.');
      obj.imgFull = constants.DIST_IMG_FULL + i + '.jpg';

      // encode base64 preview
      image.resize(16, Jimp.AUTO)
        .rgba(false)
        .deflateLevel(1)
        .getBase64(Jimp.MIME_PNG, (err, result) => {
          if (err) base64reject();
          obj.imgBase64 = result;
          if (dev) console.log('Base64 of image: ' + i + ' encoded.');
          resolveBase64();
        });
    });
  }).then(() => {
    // successfully compressed image
    if (dev) console.log('Image ' + i + ' complete.');
    resolveRoot(obj);
  }).catch(err => {
    console.log('Error compressing image ' + i + '.');
    console.log(err);
    rejectRoot(obj);
  });
})

