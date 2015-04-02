var express = require('express');
var request = require('request');
var http = require('http');
var url = require('url');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    //http.get('https://api.spotify.com/v1/me')
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    request.post(
        'https://accounts.spotify.com/api/token',
        {
            grant_type: "authorization_code",
            code: query,
            redirect_uri: "http://carnley.me/createPlaylist"
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
        }
    );
    //request.get()
    res.send("test")
});

module.exports = router;
