const fs = require('fs');
const fileExists = require('../fileExists');
const cacheFilePath = './scraperCache.json';
const dev = process.env.NODE_ENV === ('development' || 'test') ? true : false;

const checkCacheFile = (filePath) => new Promise ((resolveCheckCacheFile, rejectCheckCacheFile) => {
  if (fileExists(filePath)) {
    // file exists, parse and return json
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) console.error(err);
      resolveCheckCacheFile(JSON.parse(data));
    });
  }
  else {
    // file does not exist, return new obj
    if (dev) console.log(filePath + ' does not exist, creating new object.');
    let obj = {}
    resolveCheckCacheFile(obj);
  }
});

class Article {
  constructor(hash, title, description, imgUrl) {
    this.hash = hash;
    this.title = title;
    this.description = description;
    this.imgUrl = imgUrl;
  }
}

module.exports = (hash, title, description, imgUrl) => new Promise((resolveRoot, rejectRoot) => {
  checkCacheFile(cacheFilePath).then(obj => {
    if (obj[hash] === undefined) {
      obj[hash] = new Article(hash, title, description, imgUrl);
      fs.writeFile(cacheFilePath, JSON.stringify(obj), (err) => {
        if (err) console.error(err);
        // TODO queue if file is already being written
        if (dev) console.log(cacheFilePath + ' written.');
        resolveRoot();
      });
    }
    else {
      // cached article entry already exists
      if (dev) console.log('Cached article entry already exists.');
      rejectRoot();
    }
  });
});

module.exports.checkCacheFile = checkCacheFile;
