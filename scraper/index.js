const fs = require('fs');
const metascraper = require('metascraper');
const fetch = require('node-fetch');
const timestamp = require('console-timestamp');
const constants = require('./constants');
const objectCreator = require('./objectCreator');
const cleanFolder = require('./cleanFolder');
const storeArticleData = require('./storeArticleData');
const sanitizeImageURL = require('./sanitizeImageURL');
const fileExists = require('./fileExists');
const fetchImage = require('./fetchImage');
const compressImage = require('./compressImage');
const dev = process.env.NODE_ENV === 'development' ? true : false;

module.exports = () => new Promise((resolveRoot, rejectRoot) => {
  // Initialize object to store all data.
  let obj = objectCreator();
  let scrapeArticle;

  console.log('────────────────');
  console.log('Scraper started.');
  console.time('Scraper finished in');

  new Promise((resolveAllArticles, rejectAllArticles) => {

    cleanFolder(constants.IMG_DIR);

    fetch('https://www.reddit.com/r/worldnews/.json?limit=' + (constants.ARTICLES_TO_SCRAPE + constants.EXTRA_ARTICLES))
      .then(jsonResponse => {
        return jsonResponse.json();
      })
      .then(json => {

        let articlesReceived = 0,
          scrapeExtraArticle = 0;

        for(let i = 0; i < constants.ARTICLES_TO_SCRAPE; i++) {

          scrapeArticle = (url, i) => new Promise((resolveFetch, rejectFetch) => {

            metascraper.scrapeUrl(url).then((metaData) => {

              if (dev) console.log('Scraped article: ' + i + '.');
              obj = storeArticleData(obj, json, metaData, i, scrapeExtraArticle);
              const img = sanitizeImageURL(metaData.image, i);

              fetchImage(img, i).then(fileName => {
                resolveFetch(i);
              });

            }).catch(err => {
              console.log('Could not scrape metadata from: ' + json.data.children[i].data.url);
              console.log(err);
              rejectFetch(err);
            });

          }).then(i => {
            // successfully stored metadata and image
            compressImage(obj[i], i).then(result => {
              obj[i] = result;
              articlesReceived++;
              if (dev) console.log(articlesReceived + '/' + constants.ARTICLES_TO_SCRAPE);

              if (articlesReceived === constants.ARTICLES_TO_SCRAPE) {
                if (dev) console.log('All articles complete.\n');
                resolveAllArticles(obj);
              }
            }).catch(err => {
              console.log('Could not compress image ' + i);
              console.log(err);
            });

          }).catch(err => {
            console.log('Could not fetch article ' + i);

            if (scrapeExtraArticle === constants.EXTRA_ARTICLES) {
              rejectAllArticles(err);
            }

            // Catch unscraped article and try to fill object entry with a new article.
            scrapeExtraArticle++;
            console.log('\n\nScraping extra article to fill object entry: ' + i + '\n\n');
            scrapeArticle(json.data.children[(constants.ARTICLES_TO_SCRAPE - 1 + scrapeExtraArticle)].data.url, i);
          });

          scrapeArticle(json.data.children[i].data.url, i);

        } // for loop

      }).catch(err => {
        console.log('Could not fetch WorldNews json.');
        console.log(err);
      });

  }).then(obj => {
    console.log('Current server time: ' + timestamp());
    console.timeEnd('Scraper finished in');
    resolveRoot(obj); // export obj
  }).catch(err => {
    // No more possible articles to scrape
    console.log('Could not complete ' + constants.ARTICLES_TO_SCRAPE + ' out of ' + constants.ARTICLES_TO_SCRAPE + constants.EXTRA_ARTICLES + ' possible articles.');
    console.log(err);
    rejectRoot(err);
  });

}) // root promise

