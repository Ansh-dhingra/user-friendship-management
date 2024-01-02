const express = require('express');
const router = express.Router();

const testRouter = require('./test/routes');

const { search } = require('./controllers/searchController');
const { addFriend, removeFriend } = require('./controllers/friendController');

router.get('/search/:userId/:query', search);
router.get('/friend/:userId/:friendId', addFriend);
router.get('/unfriend/:userId/:friendId', removeFriend);

/* Testing purpose only */
router.use('test', testRouter);

module.exports = router;