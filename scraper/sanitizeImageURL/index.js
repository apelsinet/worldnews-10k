module.exports = (imgURL, i) => {
  let img = imgURL;
  if (img == undefined || img == '') {
    console.log(i + '. Image for article ' + i + ' not found.');
    return '';
  }
  return img;
}

