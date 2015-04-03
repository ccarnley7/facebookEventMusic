var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/facebookspotify');


var passport = require('passport'), OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

/*
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/facebookspotify');

var User = mongoose.model('User', {
    userID: Number,
    accessToken: String,
    refreshToken: String,
    provider: String,
    name: String
});
*/

var routes = require('./routes/index');
var users = require('./routes/users');
var createPlaylist = require('./routes/createPlaylist');
var facebookCallback = require('./routes/facebookCallback');
var spotifyLogin = require('./routes/spotifyLogin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
    req.db = db;
    next();
});

passport.use('spotify', new OAuth2Strategy({
        authorizationURL: 'https://accounts.spotify.com/authorize',
        tokenURL: 'https://accounts.spotify.com/api/token',
        clientID: '9932de46f05142d78e589f44b3cec17f',
        clientSecret: '089f6779318e41cca8d47c883b793d78',
        callbackURL: 'http://carnley.me/spotifyLogin/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        var mongodb = db;
        var collection = mongodb.get('user');

        collection.insert({
            "username" : "test",
            "email" : "christian@test.com"
        }, function (err, doc) {
            if (err) {
                // If it failed, return error
                //res.send("There was a problem adding the information to the database.");
                done(err, null)
            }
            else {
                // If it worked, set the header so the address bar doesn't still say /adduser
                //res.location("userlist");
                // And forward to success page
                //res.redirect("userlist");
                done(err, null)
            }
        });

        /*User.findOne({ userID: profile.id }, function(err, user) {
            if(err) { console.log(err); }
            if (!err && user != null) {
                done(null, user);
            } else {
                var user = new User({
                    userID: profile.id,
                    name: profile.displayName,
                    provider: "spotify",
                    accessToken : accessToken,
                    refreshToken: refreshToken
                });
                user.save(function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("saving user ...");
                        done(null, user);
                    };
                });
            };
        });*/
    }
));

app.use('/', routes);
app.use('/users', users);
app.use('/createPlaylist', createPlaylist);
app.use('/facebookCallback', facebookCallback);
app.use('/spotifyLogin', spotifyLogin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
