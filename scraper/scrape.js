const fs = require('fs');
const metascraper = require('metascraper');
const fetch = require('node-fetch');
const timestamp = require('console-timestamp');

// Internal modules
const constants = require(__dirname + '/modules/constants');
const objectCreator = require(__dirname + '/modules/objectCreator');
const cleanFolder = require(__dirname + '/modules/cleanFolder');
const storeArticleData = require(__dirname + '/modules/storeArticleData');
const sanitizeImageURL = require(__dirname + '/modules/sanitizeImageURL');
const fileExists = require(__dirname + '/modules/fileExists');
const fetchImages = require(__dirname + '/modules/fetchImages');
const compressImages = require(__dirname + '/modules/compressImages');

module.exports = () => new Promise((resolveRoot, rejectRoot) => {
  // Initialize object to store all data.
  let obj = objectCreator();
  let scrapeArticle;

  console.log('Scraper started.\n');
  console.time('Scraper finished in');

  new Promise((resolveAllArticles, rejectAllArticles) => {

    cleanFolder(constants.IMG_DIR);

    fetch('https://www.reddit.com/r/worldnews/.json?limit=' + constants.ARTICLES_TO_SCRAPE + constants.EXTRA_ARTICLES)
      .then(jsonResponse => {
        return jsonResponse.json();
      })
      .then(json => {

        let articlesReceived = 0,
          scrapeExtraArticle = 0;

        for(let i = 0; i < constants.ARTICLES_TO_SCRAPE; i++) {

          new Promise((resolveFetch, rejectFetch) => {

            scrapeArticle = (url, i) => {

              metascraper.scrapeUrl(url).then((metaData) => {

                console.log('Scraped article: ' + i + '.');
                obj = storeArticleData(obj, json, metaData, i);
                const img = sanitizeImageURL(metaData.image, i);

                fetchImages(img, i).then(fileName => {
                  resolveFetch(i);
                });

              }).catch(err => {
                console.log('Could not scrape metadata from: ' + json.data.children[i].data.url);
                console.log(err);
                rejectFetch(err);
              });

            } //scrapeArticle function

            scrapeArticle(json.data.children[i].data.url, i);

          }).then(i => {
            // successfully stored metadata and image
            compressImages(obj[i], i).then(result => {
              obj[i] = result;
              articlesReceived++;
              console.log(articlesReceived + '/' + constants.ARTICLES_TO_SCRAPE);

              if (articlesReceived === constants.ARTICLES_TO_SCRAPE - 1) {
                console.log('All articles complete.\n');
                resolveAllArticles(obj);
              }
            }).catch(err => {
              console.log(err);

              if (scrapeExtraArticle === constants.EXTRA_ARTICLES) {
                rejectAllArticles(err);
              }

              // Catch unscraped article and try to fill object entry with a new article.
              scrapeExtraArticle++;
              console.log('\n\nScraping extra article to fill object entry: ' + i + '\n\n');
              scrapeArticle(json.data.children[(ARTICLES_TO_SCRAPE - 1 + scrapeExtraArticle)].data.url, i);
            });

          }).catch(err => {
            console.log('Could not fetch article ' + i);
            console.log(err);
          });

        } // for loop

      }).catch(err => {
        console.log('Could not fetch WorldNews json.');
        console.log(err);
      });

  }).then(obj => {
    console.log('----------');
    console.log('Current server time: ' + timestamp());
    console.timeEnd('Scraper finished in');
    console.log('----------\n');
    resolveRoot(obj); // export obj
  }).catch(err => {
    // No more possible articles to scrape
    console.log('Could not complete ' + constants.ARTICLES_TO_SCRAPE + ' out of ' + constants.ARTICLES_TO_SCRAPE + constants.EXTRA_ARTICLES + ' possible articles.');
    console.log(err);
    rejectRoot(err);
  });

}) // root promise

