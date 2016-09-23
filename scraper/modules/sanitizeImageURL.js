const path = require('path');

const sanitizeImageURL = (imgURL, i) => {
  let img = '';
  if (imgURL != undefined) {
    img = imgURL;
  }
  else {
    console.log('Image for article ' + i + ' not found.');
    return false;
  }
  let fileType = path.extname(img);
  if (path.extname(img) == '') {
    fileType = '.jpg';
  }
  let questionMark = fileType.indexOf('?');
  fileType = fileType.substring(0, questionMark != -1 ? questionMark : fileType.length);

  if (fileType != '.jpg' && fileType != '.jpeg' && fileType != '.png' && fileType != '.gif') {
    console.log('Unknown file type for article ' + i + '.');
    return false;
  }
  return img;
}

module.exports = sanitizeImageURL;
