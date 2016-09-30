const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const fileExists = require('../');

describe('Module fileExists', function() {
  it('should always return a boolean', function() {
    expect(fileExists(null)).to.be.a('boolean');
    expect(fileExists(2)).to.be.a('boolean');
    expect(fileExists(-1)).to.be.a('boolean');
    expect(fileExists('test')).to.be.a('boolean');
    expect(fileExists({})).to.be.a('boolean');
  });
  it('should return false if given a file that doesnt exist', function() {
    expect(fileExists('./bogusFile.txt')).to.equal(false);

  });
  it('should return true if given a file that exists', function() {
    expect(fileExists('./index.js')).to.equal(true);
  });
});

