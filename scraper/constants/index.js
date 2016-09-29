function define(name, value) {
  Object.defineProperty(exports, name, {
    value:      value,
    enumerable: true
  });
}

define('ARTICLES_TO_SCRAPE', 10);
define('EXTRA_ARTICLES', 5);
define('IMG_DIR', './scraper/img/');
define('DIST_IMG_FULL', './dist/f/');

