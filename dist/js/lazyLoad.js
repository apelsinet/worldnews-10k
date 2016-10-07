var loadImage = function(i) {
  var img = document.images[i];
  var dl = new Image();
  dl.onload = function() {
    img.src = this.src;
    img.setAttribute('data-src', '');
    document.getElementById(i).className = '';
  };
  dl.src = img.getAttribute('data-src');
}

var lazyLoad = function () {
  for(var i = 0; i < 10; i++) {
    loadImage(i);
  }
  loadAsync('https://ajax.googleapis.com/ajax/libs/webfont/1.6.16/webfont.js', function() {
    WebFont.load({
      google: {
        families: ['Open Sans', 'Belgrano']
      }
    });
  });
  window.removeEventListener('load', lazyLoad);
}

function loadAsync(url, cb) {
  var d = document, t = 'script',
    o = d.createElement(t),
    s = d.getElementsByTagName(t)[0];
  o.src = url;
  if (cb) {
    o.addEventListener('load', function (err) {
      cb(null, err);
    }, false);
  }
  s.parentNode.insertBefore(o, s);
}

window.addEventListener('load', lazyLoad);

