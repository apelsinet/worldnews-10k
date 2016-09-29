const fs = require('fs');

module.exports = (i, destination) => new Promise((resolveGenericSaved, rejectGenericSaved) => {
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
      console.log('Saved image: ' + i + '. Generic image.');
      resolveGenericSaved(destination);
    });
  });
});

