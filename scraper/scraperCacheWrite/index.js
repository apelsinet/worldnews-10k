const fs = require('fs');
const fileExists = require('../fileExists');
const cacheFilePath = './scraperCache.json';
const dev = process.env.NODE_ENV === ('development' || 'test') ? true : false;

const checkCacheFile = (filePath) => {
  if (fileExists(filePath)) {
    // file exists, parse and return json
    let data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  }
  else {
    // file does not exist, return new obj
    if (dev) console.log(filePath + ' does not exist, creating new object.');
    let obj = {}
    return obj;
  }
}

class Article {
  constructor(hash, title, description, imgUrl, base64) {
    this.hash = hash;
    this.title = title;
    this.description = description;
    this.imgUrl = imgUrl;
    this.base64 = base64;
  }
}

module.exports = (hash, title, description, imgUrl, base64) => {
  let obj = checkCacheFile(cacheFilePath);
  if (obj[hash] === undefined) {
    obj[hash] = new Article(hash, title, description, imgUrl, base64);
    fs.writeFileSync(cacheFilePath, JSON.stringify(obj));
    if (dev) console.log(cacheFilePath + ' written.');
    return;
  }
  else {
    // cached article entry already exists
    return;
  }
}

module.exports.checkCacheFile = checkCacheFile;

