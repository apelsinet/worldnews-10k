const fs = require('fs');
const fetch = require('node-fetch');
const fileType = require('file-type');
const Jimp = require('jimp');
const constants = require(__dirname + '/constants');
const fileExists = require(__dirname + '/fileExists');

const filePath = constants.IMG_DIR;

const writeGenericImage = (i) => {
  fs.writeFileSync(constants.IMG_DIR + i + '.jpg', fs.readFileSync('./dist/not_found.jpg'));
  console.log('Saved image: ' + i + '. Generic image.');
}

const FetchImages = {
  get: (url, i) => new Promise((resolveRoot, rejectRoot) => {

    if (url === false) {
      console.log('No url for image ' + i);
      writeGenericImage(i);
      resolveRoot(filePath + i + '.jpg');
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
            writeGenericImage(i);
            resolveRoot(filePath + i + '.jpg');
          });
        }

        else {
          // not a jpg or png
          console.log('Image ' + i + ' is not a jpg or png.');
          writeGenericImage(i);
          resolveRoot(filePath + i + '.jpg');
        }

      }).catch(err => {
        // could not fetch url
        console.error(err);
        writeGenericImage(i);
        resolveRoot(filePath + i + '.jpg');
      });

    } // url is not false
  })
}

module.exports = FetchImages;

