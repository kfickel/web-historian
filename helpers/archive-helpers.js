var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function read(err, data) {
    if (err) {
      throw err;
    } else {
      callback(data.split('\n'));
    }

  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(list) {
    if (list.indexOf(url) > -1) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

exports.addUrlToList = function(url, callback) {
  if (!exports.isUrlInList(url, function(boolean) { return boolean; })) {
    fs.appendFile(exports.paths.list, url, 'utf8', function append(err) {
      if (err) {
        throw err;
      } else {
        callback(url);
      }
    }); 
  }    
};

exports.isUrlArchived = function(url, callback) {
  fs.exists(exports.paths.archivedSites + '/' + url, (exists) => {
    if (exists) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

exports.downloadUrls = function(urls) {
  for (var i = 0; i < urls.length; i++) {
    var url = urls[i];
    fs.exists(exports.paths.archivedSites + '/' + url, (exists) => {
      if (!exists) {
        fs.open(exports.paths.archivedSites + '/' + url, 'w', (err, fd) => {
          var addHttp = 'http://' + url;
          http.get(addHttp, function(res) {
            res.setEncoding('utf8');
            var rawData = '';
            res.on('data', (chunk) => {
              rawData += chunk;
            });
            res.on('end', () => {
              fs.writeFile(exports.paths.archivedSites + '/' + url, rawData, (err) => {
                if (err) {
                  throw err;
                }
              });
            });
          });
        });
      }
    });
  }
};
