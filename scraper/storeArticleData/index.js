const constants = require('../constants');
const sanitizeImageURL = require('../sanitizeImageURL');

const removePipe = (title) => {
  const s = title;
  const n = s.indexOf('|');
  return s.substring(0, n !== -1 ? n : s.length);
}

const shortenString = (string, threshold) => {
  const s = string;
  const n = s.indexOf(' ', threshold);
  return s.substring(0, n !== -1 ? n : s.length).concat(' ...');
}

const fixQuotes = (string) => {
  const stringReplacer = (quoteType, string, isEven = true, fromIndex = 0) => {
    if (string.indexOf(quoteType) !== -1) {
      if (isEven === true) {
        return stringReplacer(quoteType, string.replace(quoteType, '\u201C'), false, string.indexOf(quoteType));
      }
      else {
        return stringReplacer(quoteType, string.replace(quoteType, '\u201D'), true, string.indexOf(quoteType));
      }
    }
    else return string;
  }

  return stringReplacer('&#34;', stringReplacer('\u0022', stringReplacer('&quot;', stringReplacer('&#x22;', string))));
}

// Mutation
const processTitle = (redditTitle, scrapedData) => {
  let t = removePipe(redditTitle);
  if (t.length > 200 && scrapedData.title !== undefined && scrapedData.image !== undefined && scrapedData.description !== undefined) {
    t = removePipe(scrapedData.title);
  }
  if (t.length > 200) {
    t = shortenString(t, 200);
  }
  t = t.trim();
  t = fixQuotes(t);
  return t;
}

// Mutation
const processDescription = (description, title) => {
  let d = description;
  if (d !== undefined) {
    // Trim whitespace and newlines from string.
    d = d.trim();
    if (d.length > 300) {
      d = shortenString(description, 300);
    }
    d = fixQuotes(d);
  }

  else {
    // Description not found, write empty string
    d = '';
  }

  if (title.length > 200) {
    // Title too long, write empty string
    d = '';
  }
  return d;
}

module.exports = (article, redditData, scrapedData, extraArticles, isExtraArticle) => {

  // Mutation
  let redditDataNumber = article.id;
  if (isExtraArticle) {
    redditDataNumber = (constants.ARTICLES_TO_SCRAPE - 1 + extraArticles);
  }

  const url = redditData.data.children[redditDataNumber].data.url;
  const title = processTitle(redditData.data.children[redditDataNumber].data.title, scrapedData);
  const description = processDescription(scrapedData.description, title);


  const comUrl = 'https://www.reddit.com' + redditData.data.children[redditDataNumber].data.permalink;
  const comCount = redditData.data.children[redditDataNumber].data.num_comments;
  const imgUrl = sanitizeImageURL(scrapedData.image, article.id);
  const imgBase64 = scrapedData.base64 === undefined ? undefined : scrapedData.base64;

  return {
    url: url,
    title: title,
    description: description,
    comUrl: comUrl,
    comCount: comCount,
    imgUrl: imgUrl,
    imgBase64: imgBase64
  }
}

module.exports.fixQuotes = fixQuotes;
