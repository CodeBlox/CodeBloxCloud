var express = require('express');

var server = require('../controllers/server');

var router = express.Router();

/* Home */
router.get('/api/server/run/:project', server.run);


module.exports = router;