const storeArticleData = (obj, json, metaData, i) => {

  let removePipe = (title) => {
    let s = title;
    var n = s.indexOf('|');
    s = s.substring(0, n != -1 ? n : s.length);
    return s;
  }
  let shortenString = (string, threshold) => {
    let s = string;
    var n = s.indexOf(' ', threshold);
    s = s.substring(0, n != -1 ? n : s.length);
    s = s.concat(' ...');
    return s;
  }

  obj[i].url = json.data.children[i].data.url;

  obj[i].title = removePipe(json.data.children[i].data.title);
  if (obj[i].title.length > 150 && metaData.title != undefined) {
    obj[i].title = removePipe(metaData.title);
  }
  if (obj[i].title.length > 150) {
    obj[i].title = shortenString(obj[i].title, 150);
  }
  obj[i].title = obj[i].title.trim();

  if (metaData.description != undefined) {
    // Trim whitespace and newlines from string.
    obj[i].desc = metaData.description.trim();
    if (obj[i].desc.length > 300) {
      obj[i].desc = shortenString(obj[i].desc, 300);
    }
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
