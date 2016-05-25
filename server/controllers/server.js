var cmd = require('node-cmd');
var randomstring = require("randomstring");
var ncp = require('ncp').ncp;
var freeport = require('freeport');
var ip = require('ip');

var config = require('../config/config');

module.exports.run = function(req, res, next) {
    var uid = randomstring.generate(5);
    
    ncp(config.codeBloxDir + 'Projects/' + req.params.project,
        config.codeBloxDir + 'Servers/' + req.params.project + '-' + uid,
        function (err) {
        if (err) {
            return console.error(err);
        }
    
        console.log('Done copying ' + req.params.project + '-' + uid);
        console.log('Search available port...');
        freeport(function(err, port) {
            if (err) throw err
            
            console.log('Start server on port ' + port);
            var command = 'pm2 start "' + config.codeBloxDir + 'Servers/' + req.params.project + '-' + uid + '/app.js" --name "' + req.params.project + '-' + uid + '" -- ' + port;
            console.log(command);
            cmd.run(command);
            
            res.json({
                url: ip.address() + ":" + port,
                name:  req.params.project + '-' + uid
            });
        });
    });
};