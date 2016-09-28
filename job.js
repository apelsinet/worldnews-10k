const fileExists = require('./scraper/modules/fileExists');
const scraper = require('./scraper/scrape');
const fs = require('fs');
const DATA_JSON = './data.json';
const minutes = 5, scraperInterval = minutes * 60 * 1000;

if (fileExists(DATA_JSON)) {
  fs.unlinkSync(DATA_JSON);
}

const runScraper = () => {
  let retriesRemaining = 5;
  scraper.run().then(result => {
    fs.writeFile('data.json', JSON.stringify(result), (err) => {
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

