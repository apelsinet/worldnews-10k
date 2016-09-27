const fs = require('fs');

// Module to resize high res images and encode low res base64 versions.
const Jimp = require('jimp');

// Internal modules
const constants = require(__dirname + '/constants');
const fileExists = require(__dirname + '/fileExists');

const CompressImages = {
  run: (obj) => new Promise((rootResolve, rootReject) => {

    new Promise((base64Resolve, base64Reject) => {
      let base64Saved = 0;
      for(let j = 0; j < constants.ARTICLES_TO_SCRAPE; j++) {

        Jimp.read(constants.IMG_DIR + j + '.jpg', function (err, image) {
          if (err) throw err;

          // clean up old file
          if (fileExists(constants.DIST_IMG_FULL + j + '.jpg')) {
            fs.unlinkSync(constants.DIST_IMG_FULL + j + '.jpg');
          }

          image.resize(640, Jimp.AUTO)
            .quality(70)
            .write(constants.DIST_IMG_FULL + j + '.jpg');
          console.log('High res version of image: ' + j + ' written.');
          obj[j].imgFull = constants.DIST_IMG_FULL + j + '.jpg';

          image.resize(16, Jimp.AUTO)
            .rgba(false)
            .deflateLevel(1)
            .getBase64(Jimp.MIME_PNG, function (err, result) {
              if (err) base64reject();
              obj[j].imgBase64 = result;
              console.log('Base64 version of image: ' + j + ' encoded.');
              base64Saved++;
              if (base64Saved == constants.ARTICLES_TO_SCRAPE - 1) {
                base64Resolve();
              }
            });
        });
      }
    })
      .then(() => {
        console.log('Image compression complete.\n');
        rootResolve(obj);
      })
      .catch(err => {
        console.log('Error compressing images.');
        console.log(err);
        rootReject(obj);
      });
  })
}

module.exports = CompressImages;
