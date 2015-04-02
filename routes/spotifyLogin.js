var express = require('express');
var router = express.Router();
var passport = require('passport')
    , OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

passport.use('spotify', new OAuth2Strategy({
        authorizationURL: 'https://accounts.spotify.com/authorize',
        tokenURL: 'https://www.provider.com/oauth2/token',
        clientID: '9932de46f05142d78e589f44b3cec17f',
        clientSecret: '089f6779318e41cca8d47c883b793d78',
        callbackURL: 'http://carnley.me/createPlaylist'
    },
    function(accessToken, refreshToken, profile, done) {
        var db = req.db;
        var collection = db.get('user');
        var user = {
            "userID" : profile.id,
            "name" : profile.name,
            "accessToken" : accessToken,
            "refreshToken" : refreshToken,
            "emails" : profile.emails
        };
        collection.insert(user , function(err, doc){
            if(err)
            {
                return done(err, null);
            }
            else
            {
                return done(err, user);
            }
        })
    }
));


router.get('/', passport.authenticate('spotify'));
router.get('/callback',
    passport.authenticate('spotify', { successRedirect: '/createPlaylist',
        failureRedirect: '/' }));


module.exports = router;
