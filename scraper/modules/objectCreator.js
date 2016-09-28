const constants = require(__dirname + '/constants');

let obj = [];
class Article {
  constructor(id, url, title, desc, comUrl, comCount, imgFull, imgBase64) {
    this.id = id;
    this.url = url;
    this.title = title;
    this.desc = desc;
    this.comUrl = comUrl;
    this.comCount = comCount;
    this.imgFull = imgFull;
    this.imgBase64 = imgBase64;
  }
}

const objectCreator = () => {
  for(let i = 0; i < constants.ARTICLES_TO_SCRAPE; i++) {
    obj[i] = new Article(i);
  }
  return obj;
}

module.exports = objectCreator;
