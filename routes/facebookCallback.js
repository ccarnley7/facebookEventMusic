var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET users listing. */
router.get('/', passport.authenticate('facebook'));

router.get('/callback',
    passport.authenticate('facebook', { successRedirect: 'http://carnley.me/',
        failureRedirect: 'http://carnley.me/' }));

module.exports = router;