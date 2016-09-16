const storeArticleData = (obj, json, responseType, i) => {
  obj[i].url = json.data.children[i].data.url;
  obj[i].title = json.data.children[i].data.title;
  if (responseType.description != undefined) {
    // Trim whitespace and newlines from string.
    obj[i].desc = responseType.description.trim();
  }
  else {
    console.log('Article description for article #' + i + ' not found. Using empty string.');
    obj[i].desc = '';
  }
  obj[i].comUrl = 'https://www.reddit.com' + json.data.children[i].data.permalink;
  obj[i].comCount = json.data.children[i].data.num_comments;
  return obj;
}

module.exports = storeArticleData;
