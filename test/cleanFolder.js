const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const fs = require('fs');
const cleanFolder = require('../scraper/cleanFolder');
const fileExists = require('../scraper/fileExists');
const dummyFolder = './test/dummyFolder';
const dummyFolderPath = './test/dummyFolder/';
const dummyFile = './test/dummyFolder/dummyFile.js';

describe('Module cleanFolder', function() {
  it('should clean a folder by removing it from fs and re-create it at the same position', function() {
    if (!fileExists(dummyFolder)) {
      fs.mkdirSync(dummyFolderPath);
    }
    fs.writeFileSync(dummyFile, fs.readFileSync('./test/server.js', 'utf8'));
    expect(fileExists(dummyFile)).to.equal(true);
    cleanFolder(dummyFolderPath);
    expect(fileExists(dummyFile)).to.equal(false);
    fs.rmdirSync(dummyFolderPath);
  });
});

