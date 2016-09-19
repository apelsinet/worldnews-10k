// Modules for scraper
const fs = require('fs');
const metascraper = require('metascraper');
const fetch = require('node-fetch');

// Modules for image-type checker
const readChunk = require('read-chunk');
const imageType = require('file-type');

// Internal modules
const constants = require(__dirname + '/modules/constants');
const objectCreator = require(__dirname + '/modules/objectCreator');
const cleanFolder = require(__dirname + '/modules/cleanFolder');
const storeArticleData = require(__dirname + '/modules/storeArticleData');
const sanitizeImageURL = require(__dirname + '/modules/sanitizeImageURL');
const fileExists = require(__dirname + '/modules/fileExists');
const convertImages = require(__dirname + '/modules/convertImages');
const compressImages = require(__dirname + '/modules/compressImages');

const Scraper = {

  run: () => new Promise((resolve, reject) => {
    // Initialize object to store all data.
    let obj = objectCreator();

    console.log('Scraper started.\n');
    console.time('Scraper finished in');

    let scraperPromise = new Promise((scraperResolve, scraperReject) => {

      cleanFolder(constants.IMG_DIR);

      fetch('https://www.reddit.com/r/worldnews/.json?limit=' + constants.ARTICLES_TO_SCRAPE + constants.EXTRA_ARTICLES)
        .then(jsonResponse => {
          return jsonResponse.json();
        }).then(json => {

          let articlesReceived = 0,
          scrapeExtraArticle = 0;

          for(let i = 0; i < constants.ARTICLES_TO_SCRAPE; i++) {

            let articlePromise = new Promise((articleResolve, articleReject) => {

              const scrapeArticle = (url, i) => {

                metascraper.scrapeUrl(url).then((metaData) => {

                  obj = storeArticleData(obj, json, metaData, i);
                  const img = sanitizeImageURL(metaData.image, i);
                  fetch(img)
                    .then(res => {

                      if (res.status != 200) {
                        console.log('Status: ' + res.status + '. Using generic image.');
                        fs.writeFileSync(constants.IMG_DIR + i, fs.readFileSync('./dist/not_found.png'));
                        return readChunk.sync('./dist/not_found.png', 0, 12);
                      }
                      else {
                        res.body.on('error', err => {
                          console.log('Error fetching image: ' + i + '.\n' + err);
                          articleReject(i);
                        });
                        res.body.pipe(fs.createWriteStream(constants.IMG_DIR + i));
                        return res.buffer();
                      }

                    }).then(buffer => {
                      obj[i].imgFormat = imageType(buffer).ext;
                      obj = convertImages(obj, i);
                      articleResolve(i);
                    }).catch(err => {
                      console.log('Could not fetch or store image: ' + img);
                      console.log(err);
                      articleReject(i);
                    });



                }).catch(err => {
                  console.log('Could not scrape data from: ' + json.data.children[i].data.url);
                  console.log(err);
                  articleReject(i);
                });

              }

              scrapeArticle(json.data.children[i].data.url, i);

            });

            articlePromise.then(i => {
              articlesReceived++;
              console.log('Articles received: ' + articlesReceived + ' of ' + constants.ARTICLES_TO_SCRAPE + '.\n');

              if (articlesReceived == constants.ARTICLES_TO_SCRAPE) {
                compressImages.inputObject(obj).then(result => {
                  obj = result;
                  scraperResolve(obj);
                }).catch(err => {
                  console.log(err);
                  scraperReject(err);
                });
              }

            }).catch(i => {
              // Catch unscraped article and try to fill object entry with a new article.
              scrapeExtraArticle++;
              console.log('\n\nScraping extra article to fill object entry: ' + i + '\n\n');
              scrapeArticle(json.data.children[ARTICLES_TO_SCRAPE - 1 + scrapeExtraArticle].data.url, i);
            });

          } // for loop

        }).catch(err => {
          console.log('Could not fetch WorldNews json.');
          console.log(err);
        });

    });

    scraperPromise.then(obj => {
      console.log('\n----------');
      console.timeEnd('Scraper finished in');
      console.log('----------\n');
      resolve(obj); // export obj
    }).catch(err => {
      console.log('Could not complete scraper job.');
      console.log(err);
      reject(err);
    });

  }) // module promise
}

module.exports = Scraper;

