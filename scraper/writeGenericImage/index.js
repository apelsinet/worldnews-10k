const fs = require('fs');

module.exports = (obj, i, destination) => new Promise((resolveGenericSaved, rejectGenericSaved) => {
  fs.readFile('./dist/generic.jpg', (err, data) => {
    if (err) {
      console.log('Could not read generic image file.');
      rejectGenericSaved(err);
    }
    fs.writeFile(destination, data, (err) => {
      if (err) {
        console.log('Could not write generic image to ' + destination + '.');
        rejectGenericSaved(err);
      }
      // pre-encoded hash
      obj.hash = '8ea406c0e4';
      console.log('Saved image: ' + i + '. Generic image.');
      resolveGenericSaved(destination);
    });
  });
});

