module.exports = (imgURL, id) => {
  const img = imgURL;
  if (img == undefined || img == '') {
    console.log(id + '. Image for article not found.');
    return '';
  }
  return img;
}

