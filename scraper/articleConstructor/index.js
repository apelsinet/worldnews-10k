class Article {
  constructor(id, url, title, description, comUrl, comCount, imgUrl, imgFileName, imgBase64) {
    this.id = id;
    this.url = url;
    this.title = title;
    this.description = description;
    this.comUrl = comUrl;
    this.comCount = comCount;
    this.imgUrl = imgUrl;
    this.imgFileName = imgFileName;
    this.imgBase64 = imgBase64;
  }
}

module.exports = (i) => {
  return new Article(i);
}

