const readChunk = require('read-chunk'); 
const imageType = require('image-type');



for(let i = 0; i < 10; i++) {
  const buffer = readChunk.sync(i, 0, 12);

  imageType(buffer);
}
