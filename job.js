const fileExists = require('./scraper/modules/fileExists');
const scraper = require('./scraper/scrape');
const fs = require('fs');
const minutes = 5, scraperInterval = minutes * 60 * 1000;

if (fileExists('data.json')) {
  fs.unlinkSync('data.json');
}

// Run scraper and create json file.
scraper.run().then(result => {
  fs.writeFile('data.json', JSON.stringify(result), (err) => {
    if (err) throw err;
    console.log('JSON file created.');
  });
}).catch(err => {
  console.log(err);
});

// Run scraper every x minutes.
setInterval(() => {
  scraper.run().then(result => {
    fs.writeFile('data.json', JSON.stringify(result), (err) => {
      if (err) throw err;
      console.log('JSON file updated.');
    });
  }).catch(err => {
    console.log(err);
  });
}, scraperInterval);


