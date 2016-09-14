const fs = require('fs');
const rimraf = require('rimraf');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminPngout = require('imagemin-pngout');
const imageminAdvpng = require('imagemin-advpng');
const imageminZopfli = require('imagemin-zopfli');
const JPEGDecoder = require('jpg-stream/decoder');
const PNGEncoder = require('png-stream/encoder');

const numArticles = 10;
rimraf.sync('./dist/c/png');
fs.mkdirSync('./dist/c/png');
rimraf.sync('./dist/c/opt');
fs.mkdirSync('./dist/c/opt');

for(let i = 0; i < numArticles; i++) {
  fs.createReadStream('./dist/c/' + i + '.jpg')
    .pipe(new JPEGDecoder)
    .pipe(new PNGEncoder)
    .pipe(fs.createWriteStream('./dist/c/png/' + i + '.png'));
}

imagemin(['./dist/c/png/0.png'], './dist/c/opt', {
                       plugins: [
                         imageminPngquant()
                       ]
                       })
                       .then(files => {
                       console.log(files);
    //=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
    })
.catch(reason => {
  console.log(reason);
});
