var path = require('path');
var archive = require('../helpers/archive-helpers');
var httphelp = require('./http-helpers');
// require more modules/folders here!

var actions = {
  'GET': function(req, res) {
    // console.log('HERE');
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
    // console.log('POST', req);
    // var body = [];
    var body = '';
    req.on('data', function (chunk) {
      // body.push(chunk);
      body += chunk;
    }).on('end', function () {
      // body = Buffer.concat(body).toString();
      body = body.slice(4) + '\n';
      archive.addUrlToList(body, function(url) {
        res.writeHead(302, httphelp.headers);
        res.end();
      });
      console.log('BODY ', body);
    });

    // httphelp.serveAssets(res, 'index.html', function(data) {
    //   console.log('DATA ', data);
    //   res.writeHead(200, httphelp.headers);
    //   res.end(data.toString());
    // });
     
    // archive.addUrlToList(req.url, function(url) {
    //   res.writeHead(302, httphelp.headers);
    //   res.end(url.toString());
    // });
  }
};

var clientPaths = {
  '/': '/'
};

exports.handleRequest = function (req, res) {
  console.log('METHOD ', req.method);
  if (actions[req.method]) {
    if (req.url === clientPaths[req.url] && req.method === 'GET') {
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

