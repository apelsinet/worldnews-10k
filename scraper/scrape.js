// Modules for scraper
const rimraf = require('rimraf');
const fs = require('fs');
const metascrape = require('metascrape');
const wget = require('node-wget');
const path = require('path');
const fetch = require('node-fetch');

// Modules for image-type checker
const readChunk = require('read-chunk');
const imageType = require('image-type');

// Modules for converting images to JPG
const JPEGEncoder = require('jpg-stream/encoder');
const PNGDecoder = require('png-stream/decoder');
const GIFDecoder = require('gif-stream/decoder');
const ColorTransform = require('color-transform');

// Modules for optimizing JPG images
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');

// Modules for creating low-res preview images
const Jimp = require('jimp');

// Constants
const ARTICLES_TO_SCRAPE = 10;
const IMG_DIR = './scraper/img/';
const DIST_IMG_FULL = './dist/f/';
const DIST_IMG_COMP = './dist/c/';

let obj = [];
function article(id, url, title, desc, comUrl, comCount, imgPath, imgFull, imgComp) {
  this.id = id;
  this.url = url;
  this.title = title;
  this.desc = desc;
  this.comUrl = comUrl;
  this.comCount = comCount;
  this.imgPath = imgPath;
  this.imgFull = imgFull;
  this.imgComp = imgComp;
}
console.log('Scraper started.');
console.time('Scraper finished in');

console.log('Rimraf:\n' + IMG_DIR);
rimraf.sync(IMG_DIR);
console.log('Make dir:\n' + IMG_DIR);
fs.mkdirSync(IMG_DIR);

fetch('https://www.reddit.com/r/worldnews/.json?limit=' + ARTICLES_TO_SCRAPE)
.then(function(res) {
  return res.json();
}).then(function(json) {
  let articlesReceived = 0;
  for(let i = 0; i < ARTICLES_TO_SCRAPE; i++) {
    metascrape.fetch(json.data.children[i].data.url, 1000).then((response) => {
      for (type in response) {
        if (type == 'openGraph') {
          obj[i] = new article(i);

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

          wget({
            url: img,
            dest: IMG_DIR + i + fileType
          },
          function(err, res) {
            if (err) {
              console.log('Image ' + i + ' failed to wget. Error: ' + err);
            }
            else {
              console.log('Saved image to ' + IMG_DIR + i + fileType + '\n');
              obj[i].imgPath = IMG_DIR + i + fileType;

              articlesReceived++;
              console.log('Articles received: ' + articlesReceived + ' of ' + ARTICLES_TO_SCRAPE + '.');

              if (articlesReceived == ARTICLES_TO_SCRAPE) {
                console.log('\n----------');
                console.timeEnd('Scraper finished in');
                console.log('----------\n');

                let buffer;
                console.log('Checking image-types for ' + ARTICLES_TO_SCRAPE + ' images and converting other formats to JPG.\n');
                for(let j = 0; j < ARTICLES_TO_SCRAPE; j++) {
                  buffer = readChunk.sync(obj[j].imgPath, 0, 12);
                  console.log('Image ' + j + ': ' + imageType(buffer).ext);

                  if (imageType(buffer).ext == 'png') {
                    // convert a PNG to a JPEG
                    fs.createReadStream(IMG_DIR + j + '.png')
                      .pipe(new PNGDecoder)
                      .pipe(new ColorTransform('rgb'))
                      .pipe(new JPEGEncoder({ quality: 80 }))
                      .pipe(fs.createWriteStream(IMG_DIR + j + '.jpg'));
                    console.log('Converted PNG to JPG. New image path: ' + IMG_DIR + j + '.jpg');
                    obj[j].imgPath = IMG_DIR + j + '.jpg';
                    fs.unlinkSync(IMG_DIR + j + '.png');
                    console.log('Removed old PNG file.');
                  }

                  else if (imageType(buffer).ext == 'gif') {
                    // convert a GIF to a JPEG
                    fs.createReadStream(IMG_DIR + j + '.gif')
                      .pipe(new GIFDecoder)
                      .pipe(new JPEGEncoder({ quality: 80 }))
                      .pipe(fs.createWriteStream(IMG_DIR + j + '.jpg'));
                    console.log('Converted GIF to JPG. New image path: ' + IMG_DIR + j + '.jpg');
                    obj[j].imgPath = IMG_DIR + j + '.jpg';
                    fs.unlinkSync(IMG_DIR + j + '.gif');
                    console.log('Removed old GIF file.');
                  }
                }

                imagemin([IMG_DIR + '*.jpg'], IMG_DIR, {
                  plugins: [
                    imageminMozjpeg()
                  ]
                }).then(files => {
                  console.log('\nOptimized JPG images with imagemin-mozjpeg.');

                  console.log('Rimraf:\n' + DIST_IMG_FULL + '\n' + DIST_IMG_COMP);
                  rimraf.sync(DIST_IMG_FULL);
                  rimraf.sync(DIST_IMG_COMP);
                  console.log('Make dir:\n' + DIST_IMG_FULL + '\n' + DIST_IMG_COMP);
                  fs.mkdirSync(DIST_IMG_FULL);
                  fs.mkdirSync(DIST_IMG_COMP);

                  for(let j = 0; j < ARTICLES_TO_SCRAPE; j++) {
                    fs.createReadStream(IMG_DIR + j + '.jpg').pipe(fs.createWriteStream(DIST_IMG_FULL + j + '.jpg'));
                    console.log('Copied ' + IMG_DIR + j + '.jpg to ' + DIST_IMG_FULL + j + '.jpg.');
                    obj[j].imgFull = DIST_IMG_FULL + j + '.jpg';

                    Jimp.read(IMG_DIR + j + '.jpg', function (err, image) {
                      if (err) throw err;
                      image.resize(32, Jimp.AUTO)
                        .quality(80)
                        .write(DIST_IMG_COMP + j + '.jpg');
                    });
                    console.log('Save compressed copy of ' + IMG_DIR + j + '.jpg to ' + DIST_IMG_COMP + j + '.jpg');
                    obj[j].imgComp = DIST_IMG_COMP + j + '.jpg';
                  }

                  imagemin([DIST_IMG_COMP + '*.jpg'], DIST_IMG_COMP, {
                    plugins: [
                      imageminMozjpeg()
                    ]
                  }).then(files => {
                    console.log('\nOptimized compressed JPG images with imagemin-mozjpeg.');
                    console.log(obj);
                  });
                });
              }
            }
          });
        }
      }
    });
  }
});

