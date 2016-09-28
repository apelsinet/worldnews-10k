// Modules for scraper
const fs = require('fs');
const metascraper = require('metascraper');
const fetch = require('node-fetch');
const timestamp = require('console-timestamp');

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
const fetchImages = require(__dirname + '/modules/fetchImages');
const compressImages = require(__dirname + '/modules/compressImages');

const Scraper = {

  run: () => new Promise((rootResolve, rootReject) => {
    // Initialize object to store all data.
    let obj = objectCreator();
    let scrapeArticle;

    console.log('Scraper started.\n');
    console.time('Scraper finished in');

    new Promise((scraperResolve, scraperReject) => {

      cleanFolder(constants.IMG_DIR);

      fetch('https://www.reddit.com/r/worldnews/.json?limit=' + constants.ARTICLES_TO_SCRAPE + constants.EXTRA_ARTICLES)
        .then(jsonResponse => {
          return jsonResponse.json();
        })
      .then(json => {

        let articlesReceived = 0,
        scrapeExtraArticle = 0;

        for(let i = 0; i < constants.ARTICLES_TO_SCRAPE; i++) {

          let articlePromise = new Promise((articleResolve, articleReject) => {

            scrapeArticle = (url, i) => {

              metascraper.scrapeUrl(url).then((metaData) => {

                console.log('Scraped article: ' + i);
                obj = storeArticleData(obj, json, metaData, i);
                const img = sanitizeImageURL(metaData.image, i);

                fetchImages.get(img, i).then(fileName => {
                  articleResolve(i);
                });
                

              })
              .catch(err => {
                console.log('Could not scrape metadata from: ' + json.data.children[i].data.url);
                console.log(err);
                articleReject(i);
              });

            } //scrapeArticle function

            scrapeArticle(json.data.children[i].data.url, i);

          })
          .then(i => {
            articlesReceived++;

            if (articlesReceived == constants.ARTICLES_TO_SCRAPE) {
              console.log('All articles complete.\n');
              compressImages.run(obj).then(result => {
                obj = result;
                scraperResolve(obj);
              })
              .catch(err => {
                console.log(err);
                scraperReject(err);
              });
            }

          })
          .catch(i => {
            // Catch unscraped article and try to fill object entry with a new article.
            scrapeExtraArticle++;
            console.log('scrapeExtraArticle: ' + scrapeExtraArticle);
            console.log('new url: ' + json.data.children[ARTICLES_TO_SCRAPE - 1 + scrapeExtraArticle].data.url);
            console.log('\n\nScraping extra article to fill object entry: ' + i + '\n\n');
            scrapeArticle(json.data.children[ARTICLES_TO_SCRAPE - 1 + scrapeExtraArticle].data.url, i);
          });

        } // for loop

      })
      .catch(err => {
        console.log('Could not fetch WorldNews json.');
        console.log(err);
      });

    })
    .then(obj => {
      console.log('\n----------');
      console.log('Current server time: ' + timestamp());
      console.timeEnd('Scraper finished in');
      console.log('----------\n');
      rootResolve(obj); // export obj
    })
    .catch(err => {
      console.log('Could not complete scraper job.');
      console.log(err);
      rootReject(err);
    });

  }) // module promise
}

module.exports = Scraper;

