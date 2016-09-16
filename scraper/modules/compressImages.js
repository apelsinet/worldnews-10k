const constants = require(__dirname + '/constants');
const cleanFolder = require(__dirname + '/cleanFolder');

const fs = require('fs');

// Modules to optimize JPG images
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');

// Module to create low-res preview images
const Jimp = require('jimp');


let p = new Promise((resolve, reject) => {

  let compressImages = (obj) => {
    imagemin([constants.IMG_DIR + '*.jpg'], constants.IMG_DIR, {
      plugins: [
        imageminMozjpeg()
      ]
    }).then(files => {
      console.log('\nOptimized JPG images with imagemin-mozjpeg.');

      cleanFolder(constants.DIST_IMG_FULL);
      cleanFolder(constants.DIST_IMG_COMP);

      for(let j = 0; j < constants.ARTICLES_TO_SCRAPE; j++) {
        fs.createReadStream(constants.IMG_DIR + j + '.jpg').pipe(fs.createWriteStream(constants.DIST_IMG_FULL + j + '.jpg'));
        console.log('Copied ' + constants.IMG_DIR + j + '.jpg to ' + constants.DIST_IMG_FULL + j + '.jpg.');
        obj[j].imgFull = constants.DIST_IMG_FULL + j + '.jpg';

        Jimp.read(constants.IMG_DIR + j + '.jpg', function (err, image) {
          if (err) throw err;
          image.resize(32, Jimp.AUTO)
            .quality(80)
            .write(constants.DIST_IMG_COMP + j + '.jpg');
        });
        console.log('Saved compressed copy of ' + constants.IMG_DIR + j + '.jpg to ' + constants.DIST_IMG_COMP + j + '.jpg');
        obj[j].imgComp = constants.DIST_IMG_COMP + j + '.jpg';
      }

      imagemin([constants.DIST_IMG_COMP + '*.jpg'], constants.DIST_IMG_COMP, {
        plugins: [
          imageminMozjpeg()
        ]
      }).then(files => {
        if (files != '') {
          console.log('\nOptimized compressed JPG images with imagemin-mozjpeg.');
        }
        else {
          console.log('\nCould not compress JPG images further.');
        }
        resolve(obj);
      })
      .catch(err => {
        console.log('Error optimizing images in ' + constants.DIST_IMG_COMP + '.');
        console.log(err);
        reject(err);
      });
    })
    .catch(err => {
      console.log('Error optimizing images in ' + constants.IMG_DIR + '.');
      console.log(err);
    });
  }
  module.exports = compressImages;
});
p.then(obj => {
  console.log('Image compression complete.');
  return obj;
})
.catch(err => {
  console.log('Error fulfilling promise to compressImages.');
  console.log(err);
});



