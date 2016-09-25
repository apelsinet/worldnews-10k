const fs = require('fs');

// Modules for converting images to JPG
const Jimp = require('jimp');

const constants = require(__dirname + '/constants');
const fileExists = require(__dirname + '/fileExists');

const convertImages = (obj, i) => {

  if (obj[i].imgFormat == 'png') {
    // convert a PNG to a JPEG
    Jimp.read(constants.IMG_DIR + i, function (err, image) {
      if (err) {
        console.log('Could not convert PNG to JPG. Using generic image');
        fs.writeFileSync(constants.IMG_DIR + i + '.jpg', fs.readFileSync('./dist/not_found.jpg'));
      }
      else {
        image.write(constants.DIST_IMG_FULL + i + '.jpg');
        console.log('Saved image: ' + i + '. PNG -> JPG');
      }
    });

    obj[i].imgPath = constants.IMG_DIR + i + '.jpg';
    obj[i].imgFormat = 'jpg';
    // clean up old eventual files
    if (fileExists(constants.IMG_DIR + i)) {
      fs.unlinkSync(constants.IMG_DIR + i);
    }
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
