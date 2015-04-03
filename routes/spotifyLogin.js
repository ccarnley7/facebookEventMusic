var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', passport.authenticate('spotify',{ scope: ['playlist-read-private', 'playlist-modify-public', 'playlist-modify-private'] }));
router.get('/callback',
    passport.authenticate('spotify', { successRedirect: 'http://carnley.me/',
        failureRedirect: 'http://carnley.me/' }));

module.exports = router;
