const chai = require('chai');
const expect = chai.expect;
const fs = require('fs');
const fetchAndStoreImage = require('../scraper/fetchAndStoreImage');
const constants = require('../scraper/constants');
const url = 'https://assets-cdn.github.com/images/modules/logos_page/Octocat.png';
const hashedUrl = 'fe7ef0ff60';
const fakeUrl = 'http://fakeurl.jpg';

describe('Module fetchAndStoreImage', () => {

  it('should only take a string as an argument', () => {
    fetchAndStoreImage(0).catch(err => {
      expect(err).to.equal.TypeError;
    });
  });

  it('should resolve image file name that uses the hashed version of the input url as file name, or reject with an error', (done) => {
    fetchAndStoreImage(url).then(result => {
      expect(typeof result).to.equal('string');
      expect(result).to.equal(hashedUrl + '.jpg');
      done();
    });
    fetchAndStoreImage(0).catch(err => {
      expect(err instanceof Error).to.be.true;
    });
  });

  describe('constant hashedUrl', () => {
    it('should return a hashed version of the url', () => {
      expect(fetchAndStoreImage.hashedUrl).to.equal(hashedUrl);
    });
  });

  describe('function imageExistsOnFs', () => {
    it('should return true if image with hashedUrl as file name exists on fs', () => {
      fs.writeFileSync(constants.IMG_DIR + fetchAndStoreImage.hashedUrl + '.jpg', fs.readFileSync('./test/fetchAndStoreImageSpec.js', 'utf8'));
      expect(fetchAndStoreImage.imageExistsOnFs(fetchAndStoreImage.hashedUrl)).to.be.true;
      fs.unlinkSync(constants.IMG_DIR + fetchAndStoreImage.hashedUrl + '.jpg');
      expect(fetchAndStoreImage.imageExistsOnFs(fetchAndStoreImage.hashedUrl)).to.be.false
    });
  });

  describe('function fetchImage', () => {
    it('should fetch image from url and return it as a buffer', (done) => {
      fetchAndStoreImage.fetchImage(url).then(result => {
        expect(result instanceof Buffer).to.be.true;
        done();
      });
    });
    it('should reject if url string is empty', (done) => {
      fetchAndStoreImage.fetchImage('').catch(() => {
        done();
      });
    });
    it('should reject if node-fetch gives an error', (done) => {
      fetchAndStoreImage.fetchImage(fakeUrl).catch(() => {
        done();
      });
    });
  });

});

