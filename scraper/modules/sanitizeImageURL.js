const sanitizeImageURL = (imgURL, i) => {
  let img = imgURL;
  if (img == undefined || img == '') {
    console.log('Image for article ' + i + ' not found.');
    return false;
  }
  if (img.indexOf('gif') !== -1) {
    return false;
  }
  return img;
}

module.exports = sanitizeImageURL;
