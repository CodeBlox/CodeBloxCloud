var cmd = require('node-cmd');
var randomstring = require("randomstring");
var ncp = require('ncp').ncp;

var config = require('../config/config');

module.exports.run = function(req, res, next) {
    var uid = randomstring.generate(5);
    
    ncp(config.codeBloxDir + 'Projects\\' + req.params.project,
        config.codeBloxDir + 'Servers\\' + req.params.project + '-' + uid,
        function (err) {
        if (err) {
            return console.error(err);
        }
    
        console.log('done copying!');
        var command = 'pm2 start "' + config.codeBloxDir + 'Servers\\' + req.params.project + '-' + uid + '\\app.js" --name "' + req.params.project + '-' + uid + '"';
        cmd.run(command);
    });
};