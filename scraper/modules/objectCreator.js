const constants = require(__dirname + '/constants');

let obj = [];
class Article {
  constructor(id, url, title, desc, comUrl, comCount, imgPath, imgFormat, imgFull, imgComp) {
    this.id = id;
    this.url = url;
    this.title = title;
    this.desc = desc;
    this.comUrl = comUrl;
    this.comCount = comCount;
    this.imgPath = imgPath;
    this.imgFormat = imgFormat;
    this.imgFull = imgFull;
    this.imgComp = imgComp;
  }
}

const objectCreator = () => {
  for(let i = 0; i < constants.ARTICLES_TO_SCRAPE; i++) {
    obj[i] = new Article(i);
  }
  return obj;
}

module.exports = objectCreator;
