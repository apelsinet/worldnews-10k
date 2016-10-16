'use strict';
const scraper = require('./scraper');
const fileExists = require('./scraper/fileExists');
const fs = require('fs');
const DATA_JSON = './data.json';
const minutes = 5, scraperInterval = minutes * 60 * 1000;
const dev = process.env.NODE_ENV === 'development' ? true : false;

const runScraper = () => {
  let retriesRemaining = 5;
  scraper().then(result => {
    if (fileExists(DATA_JSON)) fs.unlinkSync(DATA_JSON);
    fs.writeFile(DATA_JSON, JSON.stringify(result), (err) => {
      if (err) {
        if (retriesRemaining > 0) {
          retriesRemaining--;
          setTimeout(runScraper(), 2000);
        }
        else {
          throw err;
        }
      }
      console.log('JSON file written.');
      if (dev) console.log(result);
    });
  }).catch(err => {
    console.log(err);
  });
}

// Run scraper on server start.
runScraper();

// Run scraper every x minutes.
setInterval(() => {
  runScraper();
}, scraperInterval);

