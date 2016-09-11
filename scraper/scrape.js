const metascrape = require('metascrape');
const wget = require('node-wget');
const path = require('path');
const fetch = require('node-fetch');

const ARTICLES_TO_SCRAPE = 10;
let obj = [];
function article(id, url, title, desc, comUrl, comCount, imgPath) {
  this.id = id;
  this.url = url;
  this.title = title;
  this.desc = desc;
  this.comUrl = comUrl;
  this.comCount = comCount;
  this.imgPath = imgPath;
}

console.log('Scraper started.');
console.time('Scraper finished in');
fetch('https://www.reddit.com/r/worldnews/.json?limit=' + ARTICLES_TO_SCRAPE)
.then(function(res) {
  return res.json();
}).then(function(json) {
  let articlesReceived = 0;
  for(let i = 0; i < ARTICLES_TO_SCRAPE; i++) {
    metascrape.fetch(json.data.children[i].data.url, 1000).then((response) => {
      for (type in response) {
        if (type == 'openGraph') {
          obj[i] = new article(i);

          obj[i].url = json.data.children[i].data.url;
          obj[i].title = json.data.children[i].data.title;

          if (response[type].description != undefined) {
            // Trim whitespace and newlines from string.
            obj[i].desc = response[type].description.trim();
          }
          else {
            console.log('Article description for article #' + i + ' not found. Using empty string.');
            obj[i].desc = '';
          }

          obj[i].comUrl = 'https://www.reddit.com' + json.data.children[i].data.permalink;
          obj[i].comCount = json.data.children[i].data.num_comments;

          let img = '';
          if (response[type].image != undefined) {
            img = response[type].image;
          }
          else {
            img = 'http://orig11.deviantart.net/9506/f/2011/343/a/4/reddit_alien__practice_vector__by_cheesefaceman1-d4im2hh.png';
            console.log('Image for article #' + i + ' not found. Using generic reddit image.');
          }
          let fileType = path.extname(img);
          let questionMark = fileType.indexOf('?');
          fileType = fileType.substring(0, questionMark != -1 ? questionMark : fileType.length);

          wget({
            url: img,
            dest: './scraper/img/' + i + fileType
          });

          console.log('Saved image to ./scraper/img/' + i + fileType + '\n');
          obj[i].imgPath = './scraper/img/' + i + fileType;

          articlesReceived++;
          console.log('Articles received: ' + articlesReceived + ' of ' + ARTICLES_TO_SCRAPE + '.');

          if (articlesReceived == ARTICLES_TO_SCRAPE) {
            console.log('\n----------');
            console.timeEnd('Scraper finished in');
            console.log('----------\n');
            console.log(obj);
            return module.exports(obj);
          }
        }
      }
    });
  }
});

