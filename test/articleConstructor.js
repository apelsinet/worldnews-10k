const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const constants = require('../scraper/constants');
const objectCreator = require('../scraper/objectCreator');

describe('Module objectCreator', function() {
  it('should construct an array of n indexed but otherwise empty objects', function() {
    let obj = objectCreator();
    let numberOfKeys = Object.keys(obj).length;
    expect(obj.length).to.equal(constants.ARTICLES_TO_SCRAPE);
    for(let n of obj) {
      expect(typeof n.id).to.equal('number');
      for(let i = 1; i < numberOfKeys; i++) {
        expect(n[i]).to.equal(undefined);
      }
    }
  });
});
