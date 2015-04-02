var express = require('express');
var router = express.Router();
var passport = require('passport')
    , OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

passport.use('spotify', new OAuth2Strategy({
        authorizationURL: 'https://accounts.spotify.com/authorize',
        tokenURL: 'https://www.provider.com/oauth2/token',
        clientID: '9932de46f05142d78e589f44b3cec17f',
        clientSecret: 'secret',
        callbackURL: 'http://127.0.0.1:3000/createPlaylist'
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({
            'facebook.id': profile.id
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            //No user was found... so create a new user with values from Facebook (all the profile. stuff)
            if (!user) {
                user = new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    username: profile.username,
                    provider: 'facebook',
                    //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line
                    facebook: profile._json
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
                //found user. Return
                return done(err, user);
            }
        });
    }
));


router.get('/', passport.authenticate('spotify'));
router.get('/callback',
    passport.authenticate('spotify', { successRedirect: '/createPlaylist',
        failureRedirect: '/' }));


module.exports = router;
