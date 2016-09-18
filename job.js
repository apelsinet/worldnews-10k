const scraper = require('./scraper/scrape');

let obj;
scraper.run().then(result => {
  obj = result;
  console.log(obj);
})
.catch(err => {
  console.log(err);
});
