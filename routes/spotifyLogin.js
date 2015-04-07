var express = require('express');
var router = express.Router();
var passport = require('passport'), OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

passport.use('spotify', new OAuth2Strategy({
        authorizationURL: 'https://accounts.spotify.com/authorize',
        tokenURL: 'https://accounts.spotify.com/api/token',
        clientID: '9932de46f05142d78e589f44b3cec17f',
        clientSecret: '089f6779318e41cca8d47c883b793d78',
        callbackURL: 'http://carnley.me/spotifyLogin/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        var collection = db.get('user');
        var user = {};

        request.get('https://api.spotify.com/v1/me', function(err, resp, body){
            var jsonBody = JSON.parse(body);

            user = {
                _id : jsonBody.id,
                name : jsonBody.display_name,
                accessToken : accessToken,
                refreshToken : refreshToken
            };

            collection.save(user, function (err, doc) {
                if (err) {
                    done(err, null)
                }
                else {
                    done(err, null)
                }
            });



            request.post({
                headers: {'Authorization': 'Bearer ' + accessToken,
                    'Content-Type' : 'application/json'},
                url:     'https://api.spotify.com/v1/users/'+user.userID+'/playlists',
                body:    JSON.stringify({'name': "The playlist I created for you",'public' : true})
            }, function(error, response, body){
                console.log(body);
            });


        }).auth(null, null, true, accessToken);
    }
));

router.get('/', passport.authenticate('spotify',{ scope: ['playlist-read-private', 'playlist-modify-public', 'playlist-modify-private'] }));
router.get('/callback',
    passport.authenticate('spotify', { successRedirect: 'http://carnley.me/',
        failureRedirect: 'http://carnley.me/' }));

module.exports = router;
