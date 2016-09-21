const constants = require(__dirname + '/constants');
const cleanFolder = require(__dirname + '/cleanFolder');

const fs = require('fs');

// Modules to optimize JPG images
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

// Module to create low-res preview images
const Jimp = require('jimp');



const CompressImages = {
  inputObject: (obj) => new Promise((resolve, reject) => {
    imagemin([constants.IMG_DIR + '*.jpg'], constants.IMG_DIR, {
      plugins: [
        imageminMozjpeg()
      ]
    }).then(files => {
      console.log('Optimized JPG images with imagemin-mozjpeg.\n');

      cleanFolder(constants.DIST_IMG_FULL);
      cleanFolder(constants.DIST_IMG_COMP);

      let base64promise = new Promise((base64Resolve, base64Reject) => {
        let base64Saved = 1;
        for(let j = 0; j < constants.ARTICLES_TO_SCRAPE; j++) {

          Jimp.read(constants.IMG_DIR + j + '.jpg', function (err, image) {
            if (err) throw err;
            image.resize(640, Jimp.AUTO)
              .quality(70)
              .write(constants.DIST_IMG_FULL + j + '.jpg');
            image.resize(16, Jimp.AUTO)
              .rgba(false)
              .deflateLevel(1)
              .getBase64(Jimp.MIME_PNG, function (err, result) {
                obj[j].imgBase64 = result
                base64Saved++;
                if (base64Saved == constants.ARTICLES_TO_SCRAPE) {
                  base64Resolve();
                }
              })
            .write(constants.DIST_IMG_COMP + j + '.png');
          });
          console.log('Saved compressed copy of ' + constants.IMG_DIR + j + '.jpg to ' + constants.DIST_IMG_COMP + j + '.png');
          obj[j].imgComp = constants.DIST_IMG_COMP + j + '.png';
          obj[j].imgFull = constants.DIST_IMG_FULL + j + '.jpg';
        }
      }).then(() => {
        imagemin([constants.DIST_IMG_COMP + '*.png'], constants.DIST_IMG_COMP, {
          plugins: [
            imageminPngquant()
          ]
        }).then(files => {
          if (files != '') {
            console.log('\nOptimized compressed PNG images with imagemin-pngquant.\n');
          }
          else {
            console.log('\nCould not compress PNG images further.\n');
          }
          console.log('Image compression complete.\n');
          resolve(obj);
        })
        .catch(err => {
          console.log('Error optimizing images in ' + constants.DIST_IMG_COMP + '.');
          console.log(err);
          reject(obj);
        });
      });
    })
    .catch(err => {
      console.log('Error optimizing images in ' + constants.IMG_DIR + '.');
      console.log(err);
      reject(obj);
    });
  })
}

module.exports = CompressImages;
