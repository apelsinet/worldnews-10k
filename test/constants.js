const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const constants = require('../scraper/constants');

describe('Module constants', function() {
  it('should return read-only variables', function() {
    constants.IMG_DIR = 'foo';
    expect(constants.IMG_DIR).to.not.equal('foo');
    expect(constants.IMG_DIR).to.equal('./scraper/img/');
  });
});
