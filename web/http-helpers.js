var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {
  if (asset === 'index.html') {
    fs.readFile(archive.paths.siteAssets + '/index.html', 'utf8', function read(err, data) {
      console.log('PATH ', archive.paths.siteAssets + '/index.html');
      if (err) {
        throw err;
      } else {
        callback(data);
      }
      //console.log(res);
    });
  } else {
    fs.readFile(archive.paths.archivedSites + '/' + asset, 'utf8', function read(err, data) {
      if (err) {
        throw err;
      } else {
        callback(data);
      }
      //console.log(res);
    });
  }
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
};



// As you progress, keep thinking about what helper functions you can put here!
