const chai = require('chai');
const expect = chai.expect;
const scraperCacheRead = require('../scraper/scraperCacheRead');
const scraperCacheWrite = require('../scraper/scraperCacheWrite');
const fileExists = require('../scraper/fileExists');
const hashString = require('../scraper/hashString');

const randomHash = hashString(Math.random().toString());
const randomTitle = Math.random();
const randomDescription = Math.random();
const randomImgUrl = Math.random();

describe('Module scraperCacheRead', () => {
  it('should take a hashed article url as argument and return an object with: title, description and image url', (done) => {
    scraperCacheWrite(randomHash, randomTitle, randomDescription, randomImgUrl);
    scraperCacheRead(randomHash).then(result => {
      expect(result.title).to.equal(randomTitle);
      expect(result.description).to.equal(randomDescription);
      expect(result.image).to.equal(randomImgUrl);
      done();
    }).catch(() => {
      console.log('no article entry');
      done();
    });
  });
});
