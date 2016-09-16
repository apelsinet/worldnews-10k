// Modules for scraper
const fs = require('fs');
const metascrape = require('metascrape');
const fetch = require('node-fetch');

// Modules for image-type checker
const readChunk = require('read-chunk');
const imageType = require('file-type');

const constants = require(__dirname + '/modules/constants');
const objectCreator = require(__dirname + '/modules/objectCreator');
const cleanFolder = require(__dirname + '/modules/cleanFolder');
const storeArticleData = require(__dirname + '/modules/storeArticleData');
const sanitizeImageURL = require(__dirname + '/modules/sanitizeImageURL');
const fileExists = require(__dirname + '/modules/fileExists');
const convertImages = require(__dirname + '/modules/convertImages');
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
          obj = storeArticleData(obj, json, response[type], i);
          const img = sanitizeImageURL(response[type].image);

          fetch(img)
            .then(function(res) {
              if (res.status != 200) {
                console.log('Status: ' + res.status + '. Using generic image.');
                fs.writeFileSync(constants.IMG_DIR + i, fs.readFileSync('./dist/not_found.png'));
                return readChunk.sync('./dist/not_found.png', 0, 12);
              }
              else {
                res.body.pipe(fs.createWriteStream(constants.IMG_DIR + i));
                return res.buffer();
              }
            }).then(function(buffer) {
              obj[i].imgFormat = imageType(buffer).ext;

              obj = convertImages(obj, i);
              console.log(obj[i]);

              articlesReceived++;
              console.log('Articles received: ' + articlesReceived + ' of ' + constants.ARTICLES_TO_SCRAPE + '.');
              console.log('----------\n');

              if (articlesReceived == constants.ARTICLES_TO_SCRAPE) {
                console.log('\n----------');
                console.timeEnd('Scraper finished in');
                console.log('----------\n');

                /*let pr = compressImages(obj);
                pr.then(returnedObj => {
                  console.log(returnedObj);
                }).catch(err => {
                  console.log('Could not resolve promise to compressImages.');
                  console.log(err);
                });*/
              }
            })
          .catch(err => {
            console.log('Could not fetch or store image: ' + img);
            console.log(err);
          });
        }
      }
    })
    .catch(err => {
      console.log('Could not scrape data from: ' + json.data.children[i].data.url);
      console.log(err);
    });
  }
})
.catch(err => {
  console.log('Could not fetch WorldNews json.');
  console.log(err);
});

