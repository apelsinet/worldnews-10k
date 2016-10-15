const chai = require('chai');
const expect = chai.expect;
const storeArticleData = require('../scraper/storeArticleData');

describe('Module storeArticleData', function() {

  describe('function fixQuotes', function() {
    it('should return a string with nice looking left and right quote symbols', function() {
      expect(storeArticleData.fixQuotes('"ugly quotes"')).to.equal('\u201Cugly quotes\u201D');
      expect(storeArticleData.fixQuotes('"ugly quotes"&quot;more quotes&quot;')).to.equal('\u201Cugly quotes\u201D\u201Cmore quotes\u201D');
      expect(storeArticleData.fixQuotes('\u201Cnice quotes\u201D')).to.equal('\u201Cnice quotes\u201D');
    });
  });

  describe('function removePipe', function() {
    it('should remove everything including and after a pipe character in a title', function() {
      const beforeText = 'text before pipes|and some text after';
      const afterText = 'text before pipes';
      expect(storeArticleData.removePipe(beforeText)).to.not.equal(beforeText);
      expect(storeArticleData.removePipe(beforeText)).to.equal(afterText);
      expect(storeArticleData.removePipe(afterText)).to.equal(afterText);
    });
  });

  describe('function shortenString', function() {
    it('should shorten strings longer than threshold, but only cut string at a space character, and concat ... to the end of the string', function() {
      const beforeText = 'this is some long text';
      const afterText = 'this is some...';
      expect(storeArticleData.shortenString(beforeText, 8)).to.equal(afterText);
      expect(storeArticleData.shortenString(beforeText, 12)).to.equal(afterText);
      expect(storeArticleData.shortenString(beforeText, 13)).to.not.equal(afterText);
    });
  });

  describe('function processTitle', function() {
    it('should return the shortest processed title from two sources', function() {
      const redditTitle = 'this title is very long';
      const scrapedData = {
        title: ' maybe not as long',
        description: 'description',
        image: 'image'
      }
      expect(storeArticleData.processTitle(redditTitle, scrapedData, 3)).to.equal('maybe...');
    });
  });

  describe('function processDescription', function() {
    it('should return a processed description, or an empty string if description not found, or title too long', function() {
      const shortTitle = 'short title';
      const longTitle = 'this title is way too long';
      const description = 'description needs to be shortened';
      expect(storeArticleData.processDescription(description, shortTitle, 15)).to.equal('description needs...');
      expect(storeArticleData.processDescription(description, longTitle, 15)).to.equal('');
    });
  });

});

