const metascraper = require('metascraper');
const scraperCacheRead = require('../scraperCacheRead');
const hashString = require('../hashString');
const dev = process.env.NODE_ENV === 'development' ? true : false;

module.exports = (url, i) => new Promise((resolve, reject) => {

  // Read from cache and resolve result, or reject if no cache
  scraperCacheRead(hashString(url), i).then(cache => {

    if (cache) resolve(cache);

    else {

      // No cache, scrape article
      metascraper.scrapeUrl(url).then((result) => {
        if (dev) console.log(i + '. Scraped article.');
        resolve(result);
      }).catch(err => {
        console.error(i + '. Could not scrape metadata.');
        reject(err);
      });

    }
  }).catch((err) => {
    // Error reading cache from fs
    reject(err);
  });

});

