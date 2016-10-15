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
});
/*
// dummy data for testing purposes
const json = {
  data:{
    children:[{
      data:{
        title: null,
        url: null
      }
    }]
  }
}
const metaData = {
  title: 'short initial title',
  image: 'img.jpg',
  description: 'short initial description'
}
// dummy return object to read from
let obj = [{
  title: null,
  desc: null,
  url: null
}];

describe('Module storeArticleData', function() {
  it('should remove everything including and after a pipe character in a title', function() {
    json.data.children[0].data.title = 'text before pipes|and some text after';
    obj = storeArticleData(obj, json, metaData, 0);
    expect(obj[0].title).to.equal('text before pipes');
  });

  it('should shorten titles and descriptions that are too long by either chosing a shorter alternative from metaData and/or shorten the strings themselves, and remove the description if the title still is too long', function() {
    json.data.children[0].data.title = 'JSONDATA  123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 '; // 250 chars
    metaData.title = 'METADATA  123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 '; // 230 chars

    obj = storeArticleData(obj, json, metaData, 0);
    expect(obj[0].title).to.equal('METADATA  123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 ...'); // 210 + 3 chars
    expect(obj[0].desc).to.equal('');

  });
  it('should replace ugly citation marks with nice ones', function() {
    json.data.children[0].data.title = '"this quote"';
    metaData.description = '&quot;this description&quot;';
    obj = storeArticleData(obj, json, metaData, 0);
    expect(obj[0].title).to.equal('“this quote”');
    expect(obj[0].desc).to.equal('“this description”');

  });
});
*/
