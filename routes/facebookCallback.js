var express = require('express');
var router = express.Router();
var passport = require('passport'), FacebookStrategy = require('passport-facebook').Strategy;


passport.use(new FacebookStrategy({
        clientID: '377801185740004',
        clientSecret: '12784ed027b4b2b2fed1cb15d47a9c54',
        callbackURL: "http://www.carnley.me/facebookCallback"
    },
    function(accessToken, refreshToken, profile, done) {
        console.log("Facebook token", accessToken);
        console.log("Facebook profile", profile);
        done(null, profile);
    }
));

/* GET users listing. */
router.get('/', passport.authenticate('facebook'));

router.get('/callback',
    passport.authenticate('facebook', { successRedirect: 'http://carnley.me/',
        failureRedirect: 'http://carnley.me/' }));

module.exports = router;