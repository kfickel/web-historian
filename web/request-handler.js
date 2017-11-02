var path = require('path');
var archive = require('../helpers/archive-helpers');
var httphelp = require('./http-helpers');
// require more modules/folders here!

var actions = {
  'GET': function(req, res) {
    archive.isUrlArchived(req.url, function (boolean) {
      if (boolean) {
        httphelp.serveAssets(res, req.url, function (data) {
          res.writeHead(200, httphelp.headers);
          res.end(data.toString());
        });
      } else {
        res.writeHead(404, httphelp.headers);
        res.end('{}');
      }
      return boolean;
    });
  },
  'POST': function(req, res) {
    var body = '';
    req.on('data', function (chunk) {
      body += chunk;
    }).on('end', function () {
      body = body.slice(4) + '\n';
      archive.addUrlToList(body, function(url) {
        httphelp.serveAssets(res, 'index.html', function(data) {
          res.writeHead(302, httphelp.headers);
          res.end(data.toString());
        });
      });
      // archive.downloadUrls()
    });
  }
};

var clientPaths = {
  '/': '/'
};

exports.handleRequest = function (req, res) {
  if (actions[req.method]) {
    if (req.url === clientPaths[req.url] && req.method === 'GET') {
      httphelp.serveAssets(res, 'index.html', function(data) {
        res.writeHead(200, httphelp.headers);
        res.end(data.toString());
      });
    } else {
      actions[req.method](req, res);
    }
  } else {
    return 'nothing';  
  }
};

