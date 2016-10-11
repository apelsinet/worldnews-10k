const crypto = require('crypto');

module.exports = (string) => {
  return crypto.createHash('md5').update(string).digest('hex').slice(0, 10);
}
