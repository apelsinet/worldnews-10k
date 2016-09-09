const metascrape = require('metascrape');
const wget = require('node-wget');
const path = require('path');
const fetch = require('node-fetch');

/*wget({
  url: 'https://www.reddit.com/r/worldnews/.json?limit=10',
  dest: './scraper/worldnews.json'
  });*/

fetch('https://www.reddit.com/r/worldnews/.json?limit=10')
.then(function(res) {
  return res.json();
}).then(function(json) {
  //console.log(json);

  for(let i = 0; i < 10; i++) {
        metascrape.fetch(json.data.children[i].data.url, 1000).then((response) => {
      for (type in response) {
        if (type == 'openGraph') {
          console.log('\n----------');
          console.log('Article: ' + i + '.');
          console.log('Article URL: ' + json.data.children[i].data.url);
          console.log('Article title: ' + json.data.children[i].data.title);
          console.log('Article description: ' + response[type].description);
          console.log('Comments URL: https://www.reddit.com' + json.data.children[i].data.permalink);
          console.log('Comments count: ' + json.data.children[i].data.num_comments);

          let img = response[type].image;
          let fileType = path.extname(img);
          let questionMark = fileType.indexOf('?');
          fileType = fileType.substring(0, questionMark != -1 ? questionMark : fileType.length);

          wget({
            url: img,
            dest: './scraper/img/' + i + fileType
          });

          console.log('Saved image to ./scraper/img/' + i + fileType + '\n');
          break;
        }
      }
    });
  }




});


