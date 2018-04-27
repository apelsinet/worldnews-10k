const http = require('http');
const metascraper = require('metascraper');
const scraperCacheRead = require('../scraperCacheRead');
const hashString = require('../hashString');
const dev = process.env.NODE_ENV === 'development' ? true : false;

module.exports = (url, id) => new Promise((resolve, reject) => {

  // Read from cache and resolve result, or reject if no cache
  scraperCacheRead(hashString(url), id).then(cache => {

    if (cache) resolve(cache);

    else {

      // No cache, scrape article
      metascraper.scrapeUrl(url).then((result) => {
        if (dev) console.log(id + '. Scraped article.');

        if (id === 0) {
          // Send http POST to twitter-bot
          if (dev) console.log('Sending POST to twitter-bot.');
          const postData = JSON.stringify({
            'msg': result.title
          });
          const options = {
            hostname: '127.0.0.1',
            port: '3001',
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': Buffer.byteLength(postData)
            }
          };
          let req = http.request(options, (res) => {
            if (dev) console.log(`STATUS: ${res.statusCode}`);
          });
          req.on('error', (e) => {
            console.error(`Problem with request: ${e.message}`);
          });
          req.write(postData);
          req.end();
        }

        resolve(result);
      }).catch(err => {
        console.error(id + '. Could not scrape metadata.');
        reject(err);
      });

    }
  }).catch((err) => {
    // Error reading cache from fs
    reject(err);
  });

});

