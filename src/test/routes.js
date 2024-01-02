const express = require('express');
const router = express.Router();

const { getFriendsByLevel } = require('./search');

/* Testing purpose only */
router.get('/test/search/:userId/:level/:query', getFriendsByLevel);

module.exports = router;