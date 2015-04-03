var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var https = require('https');


var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/facebookspotify');


var passport = require('passport'), OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

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
        console.log(accessToken)
        var collection = db.get('user');
        var user = {};


        var options = {
            host: 'api.spotify.com',
            path: '/v1/me',
            //This is the only line that is new. `headers` is an object with the headers to request
            headers: {'Authorization': 'Bearer ' + accessToken}
        };

        callback = function(response) {
            var str = ''
            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                user = JSON.parse(str);
            });
        }

        var req = http.request(options, callback);
        req.end();

        console.log(user);
        /*var url = 'https://api.spotify.com/v1/me';
        var headers = {
            'Authorization': 'Bearer ' + accessToken
        };


        request.get({ url: url, headers: headers }, function (e, r, body) {
            // your callback body
        });*/

        /*collection.insert({
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
