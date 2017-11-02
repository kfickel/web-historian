// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var helpers = require('../helpers/archive-helpers.js');

helpers.readListOfUrls(function(dataArray) {
  helpers.downloadUrls(dataArray);
});