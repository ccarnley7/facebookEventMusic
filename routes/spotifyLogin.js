var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', passport.authenticate('spotify'));
router.get('/callback',
    passport.authenticate('spotify', { successRedirect: '/createPlaylist',
        failureRedirect: '/' }));


module.exports = router;
