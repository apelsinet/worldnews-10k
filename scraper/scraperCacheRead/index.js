const fs = require('fs');
const fileExists = require('../fileExists');
const cacheFilePath = './scraperCache.json';

module.exports = (hash) => new Promise((resolveRoot, rejectRoot) => {
  if (fileExists(cacheFilePath)) {
    // read parse and return
    fs.readFile(cacheFilePath, 'utf8', (err, data) => {
      if (err) console.error(err);
      let obj = JSON.parse(data);
      if (obj[hash] !== undefined) {
        resolveRoot({
          title: obj[hash].title,
          description: obj[hash].description,
          image: obj[hash].imgUrl
        });
      }
      else rejectRoot();
    });
  }
  else {
    rejectRoot();
  }
});
