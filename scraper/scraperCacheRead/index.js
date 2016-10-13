const fs = require('fs');
const fileExists = require('../fileExists');
const cacheFilePath = './scraperCache.json';
const dev = process.env.NODE_ENV === 'development' ? true : false;

module.exports = (hash, i) => new Promise((resolve, reject) => {
  if (fileExists(cacheFilePath)) {
    // Read parse and return
    fs.readFile(cacheFilePath, 'utf8', (err, data) => {
      if (err) reject(err);
      let obj = JSON.parse(data);
      if (obj[hash] !== undefined) {
        if (dev) console.log(i + '. Loaded article from cache.');
        resolve({
          title: obj[hash].title,
          description: obj[hash].description,
          image: obj[hash].imgUrl
        });
      }
      // No cached entry for this article
      else resolve(false);
    });
  }
  else {
    // cacheFile does not exist
    resolve(false);
  }
});
