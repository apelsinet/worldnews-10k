const path = require('path');

const sanitizeImageURL = (imgURL, i) => {
  let img = '';
  if (imgURL != undefined) {
    img = imgURL;
  }
  else {
    img = 'http://localhost:3000/not_found.png';
    console.log('Image for article #' + i + ' not found. Using generic image.');
  }
  let fileType = path.extname(img);
  if (path.extname(img) == '') {
    fileType = '.jpg';
  }
  let questionMark = fileType.indexOf('?');
  fileType = fileType.substring(0, questionMark != -1 ? questionMark : fileType.length);

  if (fileType != '.jpg' && fileType != '.jpeg' && fileType != '.png' && fileType != '.gif') {
    img = 'http://localhost:3000/not_found.png';
    console.log('Unknown file type for article #' + i + '. Using generic image.');
  }
  return img;
}

module.exports = sanitizeImageURL;
