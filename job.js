'use strict';
const fs = require('fs');
const archiver = require('archiver');
const scraper = require('./scraper');
const fileExists = require('./scraper/fileExists');
const DATA_JSON = './data.json';
const CACHE = './scraperCache.json';
const minutes = 5, scraperInterval = minutes * 60 * 1000;
const dev = process.env.NODE_ENV === 'development' ? true : false;
let archiverHasRun;

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
      const now = new Date();
      if (/*now.getHours() === 3 && now.getMinutes() <= minutes && */archiverHasRun !== now.getDate()) {
        runArchiver(result).then(() => {
          archiverHasRun = now.getDate();
          runScraper();
        });
      }
      if (dev) console.log(result);
    });
  }).catch(err => {
    console.log(err);
  });
}

const runArchiver = (data) => new Promise((resolve, reject) => {
  const now = new Date();
  const dateString = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
  console.log(dateString);
  resolve();

});

// Run scraper on server start.
runScraper();

// Run scraper every x minutes.
setInterval(() => {
  runScraper();
}, scraperInterval);

