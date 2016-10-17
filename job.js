'use strict';
const fs = require('fs');
const archiver = require('archiver');
const scraper = require('./scraper');
const fileExists = require('./scraper/fileExists');
const constants = require('./scraper/constants');
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
        }).catch((err) => {
          console.log(err);
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
  let output = fs.createWriteStream('./archive/' + dateString + '.tar.gz');
  let archive = archiver('tar', {
    gzip: true,
    gzipOptions: {
      level: 1
    }
  });

  output.on('close', () => {
    console.log('Archive size: ' + archive.pointer() + ' total bytes');
    console.log('Archiver has been finalized and the output file has been closed.');
    resolve();
  });

  archive.on('error', (err) => {
    reject(err);
  });

  archive.pipe(output);

  for(let i = 0; i < constants.ARTICLES_TO_SCRAPE; i++) {
    archive.append(fs.createReadStream(constants.IMG_DIR + data[i].imgFileName), {name: data[i].imgFileName});
  }
  archive
    .append(fs.createReadStream('./scraperCache.json'), {name: 'scraperCache.json'})
    .finalize();
});

// Run scraper on server start.
runScraper();

// Run scraper every x minutes.
setInterval(() => {
  runScraper();
}, scraperInterval);

