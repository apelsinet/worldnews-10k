var l = function(i) {
  var img = document.images[i];
  var dl = new Image();
  dl.onload = function() {
    img.src = this.src;
    document.getElementById(i).className = '';
  };
  dl.src = '/f/' + i + '.jpg';
}

var s = function () {
  if (f === false) {
    for(var i = 0; i < 10; i++) {
      l(i);
    }
    f = true;
    async('https://ajax.googleapis.com/ajax/libs/webfont/1.6.16/webfont.js', function() {
        WebFont.load({
          google: {
            families: ['Open Sans', 'Belgrano']
          }
        });
        });
    window.removeEventListener('scroll', s);
  }
}

function async(u, c) {
  var d = document, t = 'script',
  o = d.createElement(t),
  s = d.getElementsByTagName(t)[0];
  o.src = u;
  if (c) {
    o.addEventListener('load', function (e) {
      c(null, e);
    }, false);
  }
  s.parentNode.insertBefore(o, s);
}

var f = false;
window.addEventListener('scroll', s);

