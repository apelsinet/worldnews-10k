const metascrape = require('metascrape');
const wget = require('node-wget');
var IMG = '';

metascrape.fetch('http://www.sciencealert.com/costa-rica-has-been-running-on-100-renewable-energy-for-2-months-straight', 1000).then((response) => {
for (type in response) {
  if (type == 'openGraph') {
    console.log(response[type].description);
    IMG = response[type].image;
    wget(IMG);
  }
}
});

