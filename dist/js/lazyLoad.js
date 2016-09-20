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
    window.removeEventListener('scroll', s);
  }
}

var f = false;
window.addEventListener('scroll', s);

