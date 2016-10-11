const chai = require('chai');
const expect = chai.expect;
const fs = require('fs');
const scraperCacheWrite = require('../scraper/scraperCacheWrite');
const fileExists = require('../scraper/fileExists');
const hashString = require('../scraper/hashString');

const cacheFilePath = './scraperCache.json';

const randomHash = hashString(Math.random().toString());
const randomTitle = Math.random();
const randomDescription = Math.random();
const randomImgUrl = Math.random();
const hash = hashString('testurl');
const title = 'testtitle';
const description = 'testdescription';
const imgUrl = 'testimgurl';

describe('Module scraperCacheWrite', () => {
  it('should take 4 arguments and return if json file is re/written, or if left unwritten', () => {
    scraperCacheWrite(randomHash, randomTitle, randomDescription, randomImgUrl);
    scraperCacheWrite(hash, title, description, imgUrl);
    expect(JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'))[randomHash].title).to.equal(randomTitle);
  });

  describe('function checkCacheFile', () => {
    it('should check if file exists and parse and return it if it does', () => {
      if (fileExists(cacheFilePath)) {
        expect(typeof scraperCacheWrite.checkCacheFile()).to.equal('object');
      }
    });
  });
});
