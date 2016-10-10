const fs = require('fs');
const fileType = require('file-type');
const Jimp = require('jimp');
const constants = require('../constants');
const dev = process.env.NODE_ENV === 'development' ? true : false;
const filePath = constants.IMG_DIR;

module.exports = (buffer, hashedName, i) => new Promise((resolveRoot, rejectRoot) => {

      const fileExtension = fileType(buffer).ext;

      if (fileExtension === 'jpg' || fileExtension === 'png') {
        new Promise((resolveWriteFile, rejectWriteFile) => {

          if (fileExtension === 'jpg') {
            fs.writeFile(filePath + hashedName + '.jpg', buffer, err => {
              if (err) rejectWriteFile(err);
              resolveWriteFile();
            });
          }

          else {
            // convert png > jpg
            Jimp.read(buffer, (err, image) => {
              if (err) rejectWriteFile(err);
              image.write(filePath + hashedName + '.jpg');
              resolveWriteFile();
            });
          }

        }).then(() => {
          // fetched image written ok
          if (dev) console.log(i + '. Image written: ' + hashedName + '.jpg.');
          resolveRoot();
        }).catch(err => {
          // could not write file
          console.error(err);
          rejectRoot();
        });

      }

      else {
        // not a jpg or png
        if (dev) console.log(i + '. Image not a jpg or png.');
        rejectRoot();
      }

})

