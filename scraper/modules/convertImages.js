const fs = require('fs');

// Modules for converting images to JPG
const pngToJpeg = require('png-to-jpeg');

const constants = require(__dirname + '/constants');
const fileExists = require(__dirname + '/fileExists');

const convertImages = (obj, i) => {

  if (obj[i].imgFormat == 'png') {
    // convert a PNG to a JPEG
    pngToJpeg({quality: 90})(fs.readFileSync(constants.IMG_DIR + i))
      .then(output => {
        fs.writeFileSync(constants.IMG_DIR + i + '.jpg', output);
        console.log('Saved image: ' + i + '. PNG -> JPG');
        obj[i].imgPath = constants.IMG_DIR + i + '.jpg';
        obj[i].imgFormat = 'jpg';
        // clean up old eventual files
        if (fileExists(constants.IMG_DIR + i)) {
          fs.unlinkSync(constants.IMG_DIR + i);
        }
      });
  }

  else if (obj[i].imgFormat == 'jpg') {
    fs.renameSync(constants.IMG_DIR + i, constants.IMG_DIR + i + '.jpg');
    console.log('Saved image: ' + i + '.');
    obj[i].imgPath = constants.IMG_DIR + i + '.jpg';
  }

  else {
    console.log('Error: file ' + i + ' is neither jpg or png.');
  }

  return obj[i];
}

module.exports = convertImages;
