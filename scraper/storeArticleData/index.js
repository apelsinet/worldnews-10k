module.exports = (obj, json, metaData, i) => {

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

  let fixQuotes = (string) => {
    let s = string;
    let stringReplacer = (quoteType) => {
      let count = 0;
      while(s.indexOf(quoteType) !== -1) {
        if (count % 2 === 0) {
          s = s.replace(quoteType, '\u201C');
        }
        else {
          s = s.replace(quoteType, '\u201D');
        }
        count++;
      }
    }
    if (s.indexOf('&#34;') !== -1) stringReplacer('&#34;');
    if (s.indexOf('\u0022') !== -1) stringReplacer('\u0022');
    if (s.indexOf('&quot;') !== -1) stringReplacer('&quot;');
    if (s.indexOf('&#x22;') !== -1) stringReplacer('&#x22;');
    return s;
  }

  obj[i].url = json.data.children[i].data.url;

  let tooLongTitle = false;
  obj[i].title = removePipe(json.data.children[i].data.title);
  if (obj[i].title.length > 200 && metaData.title != undefined && metaData.image != undefined && metaData.description != undefined) {
    obj[i].title = removePipe(metaData.title);
  }
  if (obj[i].title.length > 200) {
    obj[i].title = shortenString(obj[i].title, 300);
    tooLongTitle = true;
  }
  obj[i].title = obj[i].title.trim();
  obj[i].title = fixQuotes(obj[i].title);

  if (metaData.description != undefined) {
    // Trim whitespace and newlines from string.
    obj[i].desc = metaData.description.trim();
    if (obj[i].desc.length > 300) {
      obj[i].desc = shortenString(obj[i].desc, 300);
    }
    obj[i].desc = fixQuotes(obj[i].desc);
  }

  else if (tooLongTitle == true) {
    console.log('Article title for article ' + i + ' is too long. Removing description.');
    obj[i].desc = '';
  }

  else {
    console.log('Article description for article ' + i + ' not found. Using empty string.');
    obj[i].desc = '';
  }
  obj[i].comUrl = 'https://www.reddit.com' + json.data.children[i].data.permalink;
  obj[i].comCount = json.data.children[i].data.num_comments;
  return obj;
}

