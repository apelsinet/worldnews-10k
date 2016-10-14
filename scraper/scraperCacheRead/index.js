const fs = require('fs');
const fileExists = require('../fileExists');
const cacheFilePath = './scraperCache.json';
const dev = process.env.NODE_ENV === 'development' ? true : false;

module.exports = (hash, id) => new Promise((resolve, reject) => {
  if (fileExists(cacheFilePath)) {
    // Read parse and return
    fs.readFile(cacheFilePath, 'utf8', (err, data) => {
      if (err) reject(err);
      const obj = JSON.parse(data);
      if (obj[hash] !== undefined) {
        if (dev) console.log(id + '. Loaded article from cache.');
        resolve({
          title: obj[hash].title,
          description: obj[hash].description,
          image: obj[hash].imgUrl,
          base64: obj[hash].base64
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
