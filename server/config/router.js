var express = require('express');

var server = require('../controllers/server');
var download = require('../controllers/download');

var router = express.Router();

/* Server */
router.get('/api/server/run/:project', server.run);
router.get('/api/server/status', server.getServersStatus);

router.get('/api/download/:name', download.getZip);

module.exports = router;