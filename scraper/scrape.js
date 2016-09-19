// Modules for scraper
const fs = require('fs');
const metascrape = require('metascrape');
const fetch = require('node-fetch');
const ProgressBar = require('progress');

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

const stream = require('stream');

//const pug = require('pug');

const Scraper = {
  run: () => new Promise((resolve, reject) => {
    // Initialize object to store all data.
    let obj = objectCreator();

    console.log('Scraper started.');
    console.time('Scraper finished in');
    let scraperPromise = new Promise((resolve, reject) => {
      cleanFolder(constants.IMG_DIR);

      fetch('https://www.reddit.com/r/worldnews/.json?limit=' + constants.ARTICLES_TO_SCRAPE + constants.EXTRA_ARTICLES)
        .then(function(res) {
          return res.json();
        }).then(function(json) {
          let articlesReceived = 0,
          scrapeExtraArticle = 0;
          for(let i = 0; i < constants.ARTICLES_TO_SCRAPE; i++) {
            let scrapePromise = new Promise((resolve, reject) => {
              const scrapeArticle = (url, i) => {
                metascrape.fetch(url, 1000).then((response) => {
                  if (response['openGraph'] != undefined) {
                    obj = storeArticleData(obj, json, response['openGraph'], i);
                    const img = sanitizeImageURL(response['openGraph'].image, i);
                    fetch(img)
                      .then(function(res) {
                        let bar = new ProgressBar('  downloading [:bar] :percent :etas', {
                          complete: '=',
                          incomplete: ' ',
                          width: 20,
                          total: parseInt(res.headers.get('content-length'), 10)
                        });
                        res.body.on('data', function (chunk) {
                          bar.tick(chunk.length);
                        });

                        res.body.on('end', function () {
                          console.log('\n');
                        });
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
                        resolve(i);
                      })
                    .catch(err => {
                      console.log('Could not fetch or store image: ' + img);
                      console.log(err);
                      reject(i);
                    });
                  }
                  else {
                    reject('No openGraph data found.');
                  }
                })
                .catch(err => {
                  console.log('Could not scrape data from: ' + json.data.children[i].data.url);
                  console.log(err);
                  reject(i);
                });
              }
              scrapeArticle(json.data.children[i].data.url, i);
            });
            scrapePromise.then(i => {
              articlesReceived++;
              console.log('Articles received: ' + articlesReceived + ' of ' + constants.ARTICLES_TO_SCRAPE + '.');
              console.log('----------\n');

              if (articlesReceived == constants.ARTICLES_TO_SCRAPE) {
                compressImages.inputObject(obj).then(result => {
                  obj = result;
                  resolve(obj);
                }).catch(err => {
                  console.log(err);
                  reject(err);
                });
              }
            })
            .catch(i => {
              // Catch unscraped article and try to fill object entry with a new article.
              scrapeExtraArticle++;
              console.log('\n\nScraping extra article to fill object entry: ' + i + '\n\n');
              scrapeArticle(json.data.children[ARTICLES_TO_SCRAPE - 1 + scrapeExtraArticle].data.url, i);
            });
          }
        })
      .catch(err => {
        console.log('Could not fetch WorldNews json.');
        console.log(err);
      });
    }).then(obj => {
      //console.log(obj);



      console.log('\n----------');
      console.timeEnd('Scraper finished in');
      console.log('----------\n');
      resolve(obj); // export obj
    }).catch(err => {
      console.log('Could not complete scraper job.');
      console.log(err);
      reject(err);
    });
  })
}

module.exports = Scraper;

