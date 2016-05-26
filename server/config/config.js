var appRoot = require('app-root-path');
var slash = require('slash');

module.exports.codeBloxDir = slash(appRoot + "/CodeBlox/");
module.exports.tmpDir = slash(appRoot + "/tmp/");