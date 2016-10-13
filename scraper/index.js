const fs = require('fs');
const fetch = require('node-fetch');
const timestamp = require('console-timestamp');
const constants = require('./constants');
const objectCreator = require('./objectCreator');
const getData = require('./getData');
const storeArticleData = require('./storeArticleData');
const hashString = require('./hashString');
const scraperCacheWrite = require('./scraperCacheWrite');
const sanitizeImageURL = require('./sanitizeImageURL');
const fileExists = require('./fileExists');
const fetchAndStoreImage = require('./fetchAndStoreImage');
const compressImage = require('./compressImage');
const dev = process.env.NODE_ENV === 'development' ? true : false;

module.exports = () => new Promise((resolveRoot, rejectRoot) => {


  // Initialize object to store all data.
  let obj = objectCreator();

  console.log('────────────────');
  console.log('Scraper started.');
  console.time('Scraper finished in');

  // Resolve when all articles are complete
  new Promise((resolveAllArticles, rejectAllArticles) => {

    // Fetch json from Reddit API
    fetch('https://www.reddit.com/r/worldnews/.json?limit=' + (constants.ARTICLES_TO_SCRAPE + constants.EXTRA_ARTICLES)).then(res => {
      return res.json();
    }).then(redditData => {

      // Initialize completed article counts
      let articlesReceived = 0, scrapeExtraArticle = 0;

      // Start processing of all articles
      for(let i = 0; i < constants.ARTICLES_TO_SCRAPE; i++) {

        // Process 1 article
        let scrapeArticle = (url, i, isExtraArticle) => new Promise((resolveFetch, rejectFetch) => {
          getData(url, i).then((data) => {

            obj = storeArticleData(obj, redditData, data, i, scrapeExtraArticle, isExtraArticle);
            const img = sanitizeImageURL(data.image, i);
            scraperCacheWrite(hashString(url), obj[i].title, obj[i].desc, img);

            fetchAndStoreImage(img, i).then((fileName) => {
              resolveFetch(fileName);
            });

          }).catch((err) => {
            rejectFetch(err);
          });

        }).then(fileName => {
          // successfully stored metadata and image
          compressImage(obj[i], fileName, i).then(result => {
            obj[i] = result;
            articlesReceived++;
            if (dev) console.log(articlesReceived + '/' + constants.ARTICLES_TO_SCRAPE);

            if (articlesReceived === constants.ARTICLES_TO_SCRAPE) {
              if (dev) console.log('All articles complete.\n');
              resolveAllArticles(obj);
            }
          }).catch(err => {
            console.log(i + '. Could not compress image.');
            console.log(err);
          });

        }).catch(err => {
          console.log(i + '. Could not fetch article.');

          if (scrapeExtraArticle === constants.EXTRA_ARTICLES) {
            rejectAllArticles(err);
          }

          // Catch unscraped article and try to fill object entry with a new article.
          scrapeExtraArticle++;
          console.log('\n\nScraping extra article to fill object entry: ' + i + '\n\n');
          scrapeArticle(redditData.data.children[(constants.ARTICLES_TO_SCRAPE - 1 + scrapeExtraArticle)].data.url, i, true);
        });

        scrapeArticle(redditData.data.children[i].data.url, i, false);

      } // for loop

    }).catch(err => {
      console.log('Could not fetch json from Reddit API.');
      console.log(err);
    });

  }).then(obj => {
    console.log('Current server time: ' + timestamp());
    console.timeEnd('Scraper finished in');
    resolveRoot(obj); // export obj
  }).catch(err => {
    // No more possible articles to scrape
    console.log('Could not complete ' + constants.ARTICLES_TO_SCRAPE + ' out of ' + (constants.ARTICLES_TO_SCRAPE + constants.EXTRA_ARTICLES) + ' possible articles.');
    console.log(err);
    rejectRoot(err);
  });

}) // root promise

