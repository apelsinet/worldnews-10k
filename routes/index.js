var express = require('express');
var router = express.Router();
const scraper = require('../scraper/scrape');

let obj;
scraper.run().then(result => {
  obj = result;
})
.catch(err => {
  console.log(err);
});
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
    a9desc: obj[9].desc
  });
});

module.exports = router;
