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
  }
};

var clientPaths = {
  '/': '/'
};

exports.handleRequest = function (req, res) {
  if (actions[req.method]) {
    if (req.url === clientPaths[req.url]) {
      console.log('REQ URL ', req.url);
      httphelp.serveAssets(res, 'index.html', function(data) {
        console.log('data ', data);
        res.writeHead(200, httphelp.headers);
        res.end(data.toString());
      });
      // res.end(archive.paths.siteAssets + '/index.html');
    } else {
      actions[req.method](req, res);
    }
  } else {
    return 'nothing';  
  }
};

