const chai = require('chai');
const expect = chai.expect;
const scraperCacheRead = require('../scraper/scraperCacheRead');

const url = '';
const title = '';
const description = '';
const imgUrl = '';

describe('Module scraperCacheRead', () => {
  it('should take an article url as argument and return an object with: title, description and image url', (done) => {
    scraperCacheRead(url).then(result => {
      expect(result.title).to.equal(title);
      expect(result.description).to.equal(description);
      expect(result.imgUrl).to.equal(imgUrl);
      done();
    });
  });
});
