var config = require('../config/config');
var slash = require('slash');

module.exports.getZip = function(req, res, next) {
    if (req.params.name) {
        res.download(slash(config.tmpDir + req.params.name + '.zip'));
    } else {
        res.sendStatus(400);
    }
};