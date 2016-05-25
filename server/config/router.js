var express = require('express');

var server = require('../controllers/server');

var router = express.Router();

/* Server */
router.get('/api/server/run/:project', server.run);
router.get('/api/server/status', server.getServersStatus);

module.exports = router;