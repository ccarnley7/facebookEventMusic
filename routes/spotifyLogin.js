var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', passport.authenticate('spotify'));
router.get('/callback',
    passport.authenticate('spotify', { successRedirect: 'http://carnley.me/',
        failureRedirect: 'http://carnley.me/' }));

module.exports = router;
