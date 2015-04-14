var express = require('express');
var router = express.Router();
/*
var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy;
*/

/* GET home page. */
router.get('/', function(req, res, next) {
    var db = req.db;
    console.log("db", db);
    var collection = db.get('users');
    collection.find({},{},function(e,docs){
        console.log("docs", docs);
        res.render('index', {
            "title" : 'Facebook/Spotify App',
            "userlist" : docs
        });
    });


  //res.render('index', { title: 'Facebook/Spotify App' });
});

module.exports = router;




/*passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: "localhost:3000/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOrCreate(..., function(err, user) {
            if (err) { return done(err); }
            done(null, user);
        });
    }
));*/
