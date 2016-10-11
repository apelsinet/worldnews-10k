const chai = require('chai');
const expect = chai.expect;
const scraperCacheWrite = require('../scraper/scraperCacheWrite');
const fileExists = require('../scraper/fileExists');
const hashString = require('../scraper/hashString');

const cacheFilePath = './scraperCache.json';

const randomUrl = Math.random();
const randomTitle = Math.random();
const randomDescription = Math.random();
const randomImgUrl = Math.random();
const hash = hashString('testurl');
const title = 'testtitle';
const description = 'testdescription';
const imgUrl = 'testimgurl';

describe('Module scraperCacheWrite', () => {
  it('should take 4 arguments and resolve if json file is re/written', (done) => {
    scraperCacheWrite(randomUrl, randomTitle, randomDescription, randomImgUrl).then(() => {
      done();
    });
  });
  it('should take 4 arguments and reject if left unwritten', (done) => {
    scraperCacheWrite(hash, title, description, imgUrl).catch(() => {
      // this test will fail first time after creating cacheFile
      done();
    });
  });

  describe('function checkCacheFile', () => {
    it('should check if file exists and parse and return it if it does', (done) => {
      if (fileExists(cacheFilePath)) {
        scraperCacheWrite.checkCacheFile().then((obj) => {
          expect(typeof obj).to.equal('object');
          done();
        }).catch(() => {
          // cacheFile does not exist
        });
      }
      else done();
    });
  });
});
