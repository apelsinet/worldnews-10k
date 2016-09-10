const metascrape = require('metascrape');
const wget = require('node-wget');
const path = require('path');
const fetch = require('node-fetch');

const ARTICLES_TO_SCRAPE = 10;

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
          console.log('\n----------');
          console.log('Article: ' + i + '.');
          console.log('Article URL: ' + json.data.children[i].data.url);
          console.log('Article title: ' + json.data.children[i].data.title);
          if (response[type].description != undefined) {
            console.log('Article description: ' + response[type].description);
          }
          else {
            console.log('Article description not found. Returning empty string.');
            console.log('Article description: ');
          }
          console.log('Comments URL: https://www.reddit.com' + json.data.children[i].data.permalink);
          console.log('Comments count: ' + json.data.children[i].data.num_comments);

          let img = '';
          if (response[type].image != undefined) {
            img = response[type].image;
          }
          else {
            img = 'http://orig11.deviantart.net/9506/f/2011/343/a/4/reddit_alien__practice_vector__by_cheesefaceman1-d4im2hh.png';
            console.log('Image not found. Using generic reddit image.');
          }
          let fileType = path.extname(img);
          let questionMark = fileType.indexOf('?');
          fileType = fileType.substring(0, questionMark != -1 ? questionMark : fileType.length);

          wget({
            url: img,
            dest: './scraper/img/' + i + fileType
          });

          console.log('Saved image to ./scraper/img/' + i + fileType + '\n');

          articlesReceived++;
          console.log('Articles received: ' + articlesReceived + ' of ' + ARTICLES_TO_SCRAPE + '.');

          if (articlesReceived == ARTICLES_TO_SCRAPE) {
            console.log('\n----------');
            console.timeEnd('Scraper finished in');
            console.log('----------\n');
          }

          break;
        }
      }
    });
  }
});
