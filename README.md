# WorldNews-10K

This project was created for the 10kB challenge by [10k Apart](https://a-k-apart.com/). Its main goal is to present today's world news in less than 10kB. To do this we fetch json from the [/r/WorldNews](https://www.reddit.com/r/worldnews/) subreddit using Reddit's API. From this json we parse titles, URLs to articles, comment counts and comment URLs. The article URLs are fed to a scraper, which downloads article images, and gets additional article descriptions via [Open Graph](http://ogp.me/) metadata. The images are then compressed and preview versions are also scaled down and base64 encoded. These previews are displayed on initial load of the application with a blur filter on top.

## Stack
The application uses [Express.js](https://expressjs.com/) with [Pug](https://pugjs.org/api/getting-started.html) as template engine. For image processing [Jimp](https://www.npmjs.com/package/jimp) is used, together with a few small processing libraries to convert image streams from one format to another. To scrape the Open Graph metadata we use [Metascraper](https://www.npmjs.com/package/metascraper), and [node-fetch](https://www.npmjs.com/package/node-fetch) is used to fetch json and images over http. The stylesheet is written using indented [SASS](http://sass-lang.com/), and processed at server runtime using [node-sass-middleware](https://github.com/sass/node-sass-middleware).

## How to build the project

You need the following dependencies to build this project locally.

1. [Git](https://git-scm.com/downloads) - To clone the project.
2. [Node 6.0.0 or greater](https://nodejs.org) - The project is written using ECMAScript 2015, which is only supported by Node 6 or later.
3. [Node-gyp](https://github.com/nodejs/node-gyp) - Some of the dependencies require node-gyp globally installed to build correctly.
4. [Forever](https://github.com/foreverjs/forever) - To start the scraper and server as daemons.

Once you have what's needed. Install the required node modules using `npm install`. After installing all dependencies, you can start the scraper using `node job.js` and the application server in production mode using `npm start` or in debug mode using `npm run debug`. To automate this we use forever. Start both daemons using `sh start.sh`.

## Note on server performance

The original online version of this project uses NGINX to reverse proxy the express application and serve everything except the index, which is dynamic. This helps off loading express.
