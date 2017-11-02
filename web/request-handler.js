var path = require('path');
var archive = require('../helpers/archive-helpers');
var httphelp = require('./http-helpers');
// require more modules/folders here!

var actions = {
  'GET': function(req, res) {
    //is url archived
    if (archive.isUrlArchived(req.url, function (boolean) {
      return boolean;
    })) {
      httphelp.serveAssets(res, req.url, function (data) {
        console.log(req.url);
        res.writeHead(200, httphelp.headers);
        res.end(data.toString());
      });
        //if true then serve asset
    }
    //else if not archived
      //404 error
    // archive.readListOfUrls(function(url) {
    //   res.writeHead(200, httphelp.headers);
    //   console.log('OUTPUT ', url.toString());
    //   res.end(url.toString());
    // });
  }
};

var clientPaths = {
  '/': '/'
};

exports.handleRequest = function (req, res) {
  // res.end(archive.paths.list);
  // archive.readListOfUrls(function(url) {
  //   console.log(url.toString());
  //   res.writeHead(200, httphelp.headers);
  //   res.end(url.toString());
    
  // });
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

