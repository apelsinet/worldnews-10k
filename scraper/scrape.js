const metascrape = require('metascrape');
const wget = require('node-wget');
const jsonfile = require('jsonfile');
const path = require('path');

/*
   wget({
   url: 'https://www.reddit.com/r/worldnews/.json?limit=10',
   dest: './scraper/worldnews.json'
   });
 */ 

const file = './scraper/worldnews.json';
jsonfile.readFile(file, function(err, obj) {
  for(let i = 0; i < 10; i++) {
    console.log('----------');
    console.log('Article: ' + i + '.');
    console.log('Article URL: ' + obj.data.children[i].data.url);
    console.log('Article title: ' + obj.data.children[i].data.title);
    console.log('Comments URL: https://www.reddit.com' + obj.data.children[i].data.permalink);
    console.log('Comments count: ' + obj.data.children[i].data.num_comments);

    metascrape.fetch(obj.data.children[i].data.url, 1000).then((response) => {
      for (type in response) {
        if (type == 'openGraph') {
          console.log('Article: ' + i + '.');
          console.log('Description: \n' + response[type].description + '\n');

          let img = response[type].image;
          let fileType = path.extname(img);
          let questionMark = fileType.indexOf('?');
          fileType = fileType.substring(0, questionMark != -1 ? questionMark : fileType.length);

          wget({
            url: img,
            dest: './scraper/img/' + i + fileType
          });

          console.log('Saved image to ./scraper/img/' + i + fileType + '\n');
          console.log('----------');
          break;
        }
      }
    });
  }
});


