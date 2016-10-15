const constants = require('../constants');
const sanitizeImageURL = require('../sanitizeImageURL');

const removePipe = (title) => {
  const n = title.indexOf('|');
  return title.substring(0, n !== -1 ? n : title.length);
}

const shortenString = (string, threshold) => {
  const n = string.indexOf(' ', threshold);
  return string.substring(0, n !== -1 ? n : string.length).concat('...');
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

const stringTooLong = (string, threshold) => {
  if (string.length > threshold) return true;
  else return false;
}

const processString = (string, threshold) => {
  if (stringTooLong(string, threshold)) {
    return fixQuotes(shortenString(string, threshold)).trim();
  }
  else {
    return fixQuotes(string).trim();
  }
}

const processTitle = (redditTitle, scrapedData, threshold) => {
  if (stringTooLong(removePipe(redditTitle), threshold) && scrapedData.title !== undefined && scrapedData.image !== undefined && scrapedData.description !== undefined) {
    // Use scraped title if redditTitle is too long
    return processString(removePipe(scrapedData.title), threshold);

  }
  else {
    return processString(removePipe(redditTitle), threshold);
  }
}

const processDescription = (description, title, threshold) => {
  // Title too long, remove description
  if (stringTooLong(title, threshold)) return '';
  else {
    if (description !== undefined) {
      return processString(removePipe(description), threshold);
    }
    else {
      // Could not find description
      return '';
    }
  }
}

module.exports = (article, redditData, scrapedData, extraArticles, isExtraArticle) => {

  const extraArticleId = (constants.ARTICLES_TO_SCRAPE -1 + extraArticles);
  const id = isExtraArticle ? extraArticleId : article.id;

  const url = redditData.data.children[id].data.url;
  const title = processTitle(redditData.data.children[id].data.title, scrapedData, 200);
  const description = processDescription(scrapedData.description, title, 300);


  const comUrl = 'https://www.reddit.com' + redditData.data.children[id].data.permalink;
  const comCount = redditData.data.children[id].data.num_comments;
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

module.exports.removePipe = removePipe;
module.exports.shortenString = shortenString;
module.exports.fixQuotes = fixQuotes;
module.exports.processTitle = processTitle;
module.exports.processDescription = processDescription;
