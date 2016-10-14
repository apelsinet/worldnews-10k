const getData = require('../getData');
const storeArticleData = require('../storeArticleData');
const fetchAndStoreImage = require('../fetchAndStoreImage');

module.exports = (article, redditData, extraArticles, isExtraArticle) => new Promise((resolve, reject) => {
  // Get this article's url from reddit json
  const url = redditData.data.children[article.id].data.url;

  // Get meta data either from cache or by scraping it
  getData(url, article.id).then((scrapedData) => {

    const articleData = storeArticleData(article, redditData, scrapedData, extraArticles, isExtraArticle);

    fetchAndStoreImage(articleData.imgUrl, article.id).then((fileName) => {
      const imgFileName = {imgFileName: fileName};
      resolve(Object.assign({}, article, articleData, imgFileName));
    });

  }).catch((err) => {
    reject(err);
  });

})
