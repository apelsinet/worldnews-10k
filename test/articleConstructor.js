const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const constants = require('../scraper/constants');
const articleConstructor = require('../scraper/articleConstructor');

describe('Module articleConstructor', function() {
  it('should take a non-negative number as argument', function() {
    expect(articleConstructor(0)).to.not.be.false;
    expect(articleConstructor(4)).to.not.be.false;
    expect(articleConstructor(-2)).to.be.false;
    expect(articleConstructor('4')).to.be.false;
  });
  it('should return an indexed object', function() {
    expect(articleConstructor(1).id).to.equal(1);
    expect(typeof articleConstructor(2)).to.equal('object');
  });
});
