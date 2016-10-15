const fs = require('fs');
const fetch = require('node-fetch');
const timestamp = require('console-timestamp');
const constants = require('./constants');
const articleConstructor = require('./articleConstructor');
const fileExists = require('./fileExists');
const hashString = require('./hashString');
const processArticle = require('./processArticle');
const compressImage = require('./compressImage');
const scraperCacheWrite = require('./scraperCacheWrite');
const dev = process.env.NODE_ENV === 'development' ? true : false;

// Resolve when all articles are complete
module.exports = () => new Promise((resolve, reject) => {

  let obj = [];

  console.log('────────────────');
  console.log('Scraper started.');
  console.time('Scraper finished in');

  // Fetch json from Reddit API
  fetch('https://www.reddit.com/r/worldnews/.json?limit=' + (constants.ARTICLES_TO_SCRAPE + constants.EXTRA_ARTICLES)).then(res => {
    return res.json();
  }).then(redditData => {

    // Initialize completed article counts
    let articlesReceived = 0, extraArticles = 0;

    // Start processing of all articles
    for(let i = 0; i < constants.ARTICLES_TO_SCRAPE; i++) {

      // Construct 1 article with id: i
      const article = articleConstructor(i);

      // Process 1 article
      processArticle(article, redditData, extraArticles, false).then(processedArticle => {

        // Compress 1 image and encode base64
        compressImage(processedArticle).then(final => {

          // Write final version of article to cache
          scraperCacheWrite(hashString(final.url), final.title, final.description, final.imgUrl, final.imgBase64);

          // Pass it to global object
          obj[i] = final;

          articlesReceived++;
          if (dev) console.log(articlesReceived + '/' + constants.ARTICLES_TO_SCRAPE);

          // All articles received, and global object filled
          if (articlesReceived === constants.ARTICLES_TO_SCRAPE) {

            if (dev) console.log('All articles complete.\n');
            console.log('Current server time: ' + timestamp());
            console.timeEnd('Scraper finished in');
            resolve(obj);

          }

        }).catch(err => {
          console.error(article.id + '. Could not compress image.');
          console.error(err);
        });

      }).catch(err => {
        console.error(article.id + '. Could not process article.');
        console.error(err);

        // All extra articles in reddit json margin used
        if (extraArticles === constants.EXTRA_ARTICLES) {
          console.error('Could not complete ' + constants.ARTICLES_TO_SCRAPE + ' out of ' + (constants.ARTICLES_TO_SCRAPE + constants.EXTRA_ARTICLES) + ' possible articles.');
          reject(err);
        }

        // Catch unscraped article and try to fill object entry with a new article.
        extraArticles++;
        console.log('\nScraping extra article to fill object entry: ' + article.id + '\n');
        processArticle(article, redditData, extraArticles, true);
      });

    } // for loop

  }).catch(err => {
    console.error('Could not fetch json from Reddit API.');
    console.error(err);
  });

});

