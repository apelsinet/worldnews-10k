const fs = require('fs');
const fetch = require('node-fetch');
const fileType = require('file-type');
const Jimp = require('jimp');
const constants = require(__dirname + '/constants');
const fileExists = require(__dirname + '/fileExists');
const writeGenericImage = require(__dirname + '/writeGenericImage');

const filePath = constants.IMG_DIR;



module.exports = (url, i) => new Promise((resolveRoot, rejectRoot) => {

  if (url === false) {
    console.log('No url for image ' + i);
    writeGenericImage(i, filePath + i + '.jpg').then(file => {
      resolveRoot(file);
    });
  }

  else {

    fetch(url).then(res => {
      return res.buffer();
    }).then(buffer => {

      let fileExtension = fileType(buffer).ext;

      if (fileExtension === 'jpg' || fileExtension === 'png') {
        // Create file if downloaded according to rules without errors.
        new Promise((resolveFetchedFile, rejectFetchedFile) => {

          if (fileExtension === 'jpg') {
            fs.writeFile(filePath + i + '.' + fileExtension, buffer, err => {
              if (err) rejectFetchedFile(err);
              resolveFetchedFile(filePath + i + '.' + fileExtension);
            });
          }

          else {
            // convert png > jpg
            Jimp.read(buffer, (err, image) => {
              if (err) rejectFetchedFile(err);
              image.write(filePath + i + '.jpg');
              resolveFetchedFile(filePath + i + '.jpg');
            });
          }

        }).then((fileName) => {
          // fetched image written ok
          console.log('Saved image: ' + i + '.');
          resolveRoot(fileName);
        }).catch(err => {
          // could not write file
          console.error(err);
          writeGenericImage(i, filePath + i + '.jpg').then(file => {
            resolveRoot(file);
          });
        });

      }

      else {
        // not a jpg or png
        console.log('Image ' + i + ' is not a jpg or png.');
        writeGenericImage(i, filePath + i + '.jpg').then(file => {
          resolveRoot(file);
        });
      }

    }).catch(err => {
      // could not fetch url
      console.error(err);
      writeGenericImage(i, filePath + i + '.jpg').then(file => {
        resolveRoot(file);
      });
    });

  } // url is not false
})

