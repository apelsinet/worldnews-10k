const chai = require('chai');
const expect = chai.expect;
const hashString = require('../scraper/hashString');
const url = 'https://assets-cdn.github.com/images/modules/logos_page/Octocat.png';

describe('Module hashString', () => {
  it('should return hashed version of input string', () => {
    expect(hashString(url)).to.equal('fe7ef0ff609e9abc2bc87e94f0ecd15b');
  });
});
