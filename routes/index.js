const express = require('express');
const router = express.Router();
const fs = require('fs');
const DATA_JSON = './data.json';
const minutes = 2, readJsonInterval = minutes * 60 * 1000;

let obj;

const readJsonFile = (jsonFile) => {
  let retriesRemaining = 5;
  fs.readFile(jsonFile, (err, data) => {
    if (err) {
      if (retriesRemaining > 0) {
        retriesRemaining--;
        setTimeout(readJsonFile(DATA_JSON), 2000);
      }
      else {
        throw err;
      }
    }
    obj = JSON.parse(data);
  });
}

// Read json on server start.
readJsonFile(DATA_JSON);

// Read json every x minutes.
setInterval(() => {
  readJsonFile(DATA_JSON);
}, readJsonInterval);

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', {
    title: 'WorldNews 10K',
    a0title: obj[0].title,
    a1title: obj[1].title,
    a2title: obj[2].title,
    a3title: obj[3].title,
    a4title: obj[4].title,
    a5title: obj[5].title,
    a6title: obj[6].title,
    a7title: obj[7].title,
    a8title: obj[8].title,
    a9title: obj[9].title,
    a0desc: obj[0].desc,
    a1desc: obj[1].desc,
    a2desc: obj[2].desc,
    a3desc: obj[3].desc,
    a4desc: obj[4].desc,
    a5desc: obj[5].desc,
    a6desc: obj[6].desc,
    a7desc: obj[7].desc,
    a8desc: obj[8].desc,
    a9desc: obj[9].desc,
    a0url: obj[0].url,
    a1url: obj[1].url,
    a2url: obj[2].url,
    a3url: obj[3].url,
    a4url: obj[4].url,
    a5url: obj[5].url,
    a6url: obj[6].url,
    a7url: obj[7].url,
    a8url: obj[8].url,
    a9url: obj[9].url,
    a0comUrl: obj[0].comUrl,
    a1comUrl: obj[1].comUrl,
    a2comUrl: obj[2].comUrl,
    a3comUrl: obj[3].comUrl,
    a4comUrl: obj[4].comUrl,
    a5comUrl: obj[5].comUrl,
    a6comUrl: obj[6].comUrl,
    a7comUrl: obj[7].comUrl,
    a8comUrl: obj[8].comUrl,
    a9comUrl: obj[9].comUrl,
    a0comCount: obj[0].comCount,
    a1comCount: obj[1].comCount,
    a2comCount: obj[2].comCount,
    a3comCount: obj[3].comCount,
    a4comCount: obj[4].comCount,
    a5comCount: obj[5].comCount,
    a6comCount: obj[6].comCount,
    a7comCount: obj[7].comCount,
    a8comCount: obj[8].comCount,
    a9comCount: obj[9].comCount,
    a0base64: obj[0].imgBase64,
    a1base64: obj[1].imgBase64,
    a2base64: obj[2].imgBase64,
    a3base64: obj[3].imgBase64,
    a4base64: obj[4].imgBase64,
    a5base64: obj[5].imgBase64,
    a6base64: obj[6].imgBase64,
    a7base64: obj[7].imgBase64,
    a8base64: obj[8].imgBase64,
    a9base64: obj[9].imgBase64
  });
});

module.exports = router;
