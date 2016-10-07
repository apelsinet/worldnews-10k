const crypto = require('crypto');
const fs = require('fs');
const fileExists = require('../scraper/fileExists');
const jsFile = __dirname + '/js/l.js';
const cssFile = __dirname + '/css/s.css';

const jsBuffer = fs.readFileSync(jsFile, 'utf8');
const jsHashedName = crypto.createHash('md5').update(jsBuffer).digest('hex').slice(0, 10);
if (!fileExists(__dirname + '/js/' + jsHashedName + '.js')) {
  fs.writeFileSync(__dirname + '/js/' + jsHashedName + '.js', jsBuffer);
}

const cssBuffer = fs.readFileSync(cssFile, 'utf8');
const cssHashedName = crypto.createHash('md5').update(cssBuffer).digest('hex').slice(0, 10);
if (!fileExists(__dirname + '/css/' + cssHashedName + '.css')) {
  fs.writeFileSync(__dirname + '/css/' + cssHashedName + '.css', cssBuffer);
}

module.exports = {jsHash: jsHashedName, cssHash: cssHashedName};
