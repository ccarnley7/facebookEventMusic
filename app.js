var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var https = require('https');


var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/facebookspotify');
var monk = require('monk');
var db = monk('localhost:27017/facebookspotify');
var findOrCreate = require('mongoose-findorcreate')

var UserSchema = new mongoose.Schema({
    username: String,
    name: String,
    accessToken: String,
    refreshToken: String
});

UserSchema.plugin(findOrCreate);

var User = mongoose.model('User', UserSchema);

var passport = require('passport'), OAuth2Strategy = require('passport-oauth').OAuth2Strategy, FacebookStrategy = require('passport-facebook').Strategy;;

var routes = require('./routes/index');
var users = require('./routes/users');
var createPlaylist = require('./routes/createPlaylist');
var facebookCallback = require('./routes/facebookCallback');
var spotifyLogin = require('./routes/spotifyLogin');
var facebookAPI = require('./routes/facebookAPI')

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

passport.use(new FacebookStrategy({
        clientID: '377801185740004',
        clientSecret: '12784ed027b4b2b2fed1cb15d47a9c54',
        callbackURL: "http://www.carnley.me/facebookCallback/"
    },
    function(accessToken, refreshToken, profile, done) {
        console.log("Facebook token", accessToken);
        console.log("Facebook profile", profile);
        done(null, profile);
    }
));

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

            /*user = {
                _id : String(jsonBody.id),
                name : jsonBody.display_name,
                accessToken : accessToken,
                refreshToken : refreshToken
            };*/

            var user = new User({username: String(jsonBody.id), name: jsonBody.display_name, accessToken: accessToken, refreshToken:refreshToken});
            console.log("one", user);


            User.findOrCreate({username: user.username}, function(err, user, created){
                console.log("created", created);
            })

            /*user.save(function(err){
                if(err)
                    console.log(err);
                else
                    console.log("two", user);
            });*/
            /*collection.insert(user, function (err, doc) {
                *//*if (err) {
                    done(err, null)
                }
                else {
                    done(err, null)
                }*//*
            });*/
            /*var value = collection.findById(user._id, function (err, doc) {
                if(err)
                    return null;
                else
                    return doc
            });

                console.log("value" ,value);*/
               /* if (err) {
                    done(err, null)
                }
                else {
                    done(err, null)
                }
            });*/



            /*request.post({
                headers: {'Authorization': 'Bearer ' + accessToken,
                        'Content-Type' : 'application/json'},
                url:     'https://api.spotify.com/v1/users/'+user.userID+'/playlists',
                body:    JSON.stringify({'name': "The playlist I created for you",'public' : true})
            }, function(error, response, body){
                console.log(body);
            });*/
        done(err, null);

        }).auth(null, null, true, accessToken);
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
