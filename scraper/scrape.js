// Modules for scraper
const rimraf = require('rimraf');
const fs = require('fs');
const metascrape = require('metascrape');
const wget = require('node-wget');
const path = require('path');
const fetch = require('node-fetch');

// Modules for image-type checker
const readChunk = require('read-chunk');
const imageType = require('file-type');

// Modules for converting images to JPG
const JPEGEncoder = require('jpg-stream/encoder');
const PNGDecoder = require('png-stream/decoder');
const GIFDecoder = require('gif-stream/decoder');
const ColorTransform = require('color-transform');

const constants = require(__dirname + '/modules/constants');
const objectCreator = require(__dirname + '/modules/objectCreator');
const cleanFolder = require(__dirname + '/modules/cleanFolder');
const fileExists = require(__dirname + '/modules/fileExists');
const compressImages = require(__dirname + '/modules/compressImages');

// Initialize object to store all data.
let obj = objectCreator();

console.log('Scraper started.');
console.time('Scraper finished in');

cleanFolder(constants.IMG_DIR);

fetch('https://www.reddit.com/r/worldnews/.json?limit=' + constants.ARTICLES_TO_SCRAPE)
.then(function(res) {
  return res.json();
}).then(function(json) {
  let articlesReceived = 0;
  for(let i = 0; i < constants.ARTICLES_TO_SCRAPE; i++) {
    metascrape.fetch(json.data.children[i].data.url, 1000).then((response) => {
      for (type in response) {
        if (type == 'openGraph') {
          obj[i].url = json.data.children[i].data.url;
          obj[i].title = json.data.children[i].data.title;
          if (response[type].description != undefined) {
            // Trim whitespace and newlines from string.
            obj[i].desc = response[type].description.trim();
          }
          else {
            console.log('Article description for article #' + i + ' not found. Using empty string.');
            obj[i].desc = '';
          }
          obj[i].comUrl = 'https://www.reddit.com' + json.data.children[i].data.permalink;
          obj[i].comCount = json.data.children[i].data.num_comments;

          let img = '';
          if (response[type].image != undefined) {
            img = response[type].image;
          }
          else {
            img = 'http://localhost:3000/not_found.png';
            console.log('Image for article #' + i + ' not found. Using generic image.');
          }
          let fileType = path.extname(img);
          if (path.extname(img) == '') {
            fileType = '.jpg';
          }
          let questionMark = fileType.indexOf('?');
          fileType = fileType.substring(0, questionMark != -1 ? questionMark : fileType.length);
          if (fileType == '.jpeg') {
            fileType = '.jpg';
          }
          if (fileType != '.jpg' && fileType != '.png' && fileType != '.gif') {
            img = 'http://localhost:3000/not_found.png';
            console.log('Unknown file type for article #' + i + '. Using generic image.');
            fileType = '.png';
          }


          fetch(img)
            .then(function(res) {
              if (res.status != 200) {
                console.log('Status: ' + res.status + ', using generic image.');
                fs.createReadStream('./dist/not_found.png').pipe(fs.createWriteStream(constants.IMG_DIR + i));
                return fs.readFileSync('./dist/not_found.png');
              }
              else {
                let dest = fs.createWriteStream(constants.IMG_DIR + i);
                res.body.pipe(dest);
                return res.buffer();
              }
            }).then(function(buffer) {
              obj[i].imgFormat = imageType(buffer).ext;
              fs.renameSync(constants.IMG_DIR + i, constants.IMG_DIR + i + '.' + obj[i].imgFormat);

              console.log('Saved image to ' + constants.IMG_DIR + i + '.' + obj[i].imgFormat + '\n');
              obj[i].imgPath = constants.IMG_DIR + i + '.' + obj[i].imgFormat;

              articlesReceived++;
              console.log('Articles received: ' + articlesReceived + ' of ' + constants.ARTICLES_TO_SCRAPE + '.');
              console.log('----------\n');

              if (articlesReceived == constants.ARTICLES_TO_SCRAPE) {
                console.log('\n----------');
                console.timeEnd('Scraper finished in');
                console.log('----------\n');

                console.log('Checking image-types for ' + constants.ARTICLES_TO_SCRAPE + ' images and converting other formats to JPG.\n');
                for(let j = 0; j < constants.ARTICLES_TO_SCRAPE; j++) {
                  console.log('Article #' + j + '.');
                  console.log('Image ' + j + ': ' + obj[j].imgFormat);

                  if (obj[j].imgFormat == 'png') {
                    // convert a PNG to a JPEG
                    fs.createReadStream(constants.IMG_DIR + j + '.png')
                      .pipe(new PNGDecoder)
                      .pipe(new ColorTransform('rgb'))
                      .pipe(new JPEGEncoder({quality: 80}))
                      .pipe(fs.createWriteStream(constants.IMG_DIR + j + '.jpg'));
                    console.log('Converted PNG to JPG. New image path: ' + constants.IMG_DIR + j + '.jpg');
                    obj[j].imgPath = constants.IMG_DIR + j + '.jpg';
                    obj[j].imgFormat = 'jpg';
                    if (fileExists(constants.IMG_DIR + j + '.png')) {
                      fs.unlinkSync(constants.IMG_DIR + j + '.png');
                      console.log('Removed ' + constants.IMG_DIR + j + '.png');
                    }
                  }

                  else if (obj[j].imgFormat == 'gif') {
                    // convert a GIF to a JPEG
                    fs.createReadStream(constants.IMG_DIR + j + '.gif')
                      .pipe(new GIFDecoder)
                      .pipe(new JPEGEncoder())
                      .pipe(fs.createWriteStream(constants.IMG_DIR + j + '.jpg'));
                    console.log('Converted GIF to JPG. New image path: ' + constants.IMG_DIR + j + '.jpg');
                    obj[j].imgPath = constants.IMG_DIR + j + '.jpg';
                    obj[j].imgFormat = 'jpg';
                    if (fileExists(constants.IMG_DIR + j + '.png')) {
                      fs.unlinkSync(constants.IMG_DIR + j + '.png');
                      console.log('Removed ' + constants.IMG_DIR + j + '.png');
                    }
                  }
                }
                console.log('Conversion complete');
                let p = new Promise((resolve, reject) => {
                  obj = resolve(compressImages(obj));
                }).then(obj => {
                  console.log(obj);
                }).catch(err => {
                  console.log(err);
                  reject(err);
                });
              }
            })
          .catch(err => {
            console.log(err);
          });
        }
      }
    });
  }
});

