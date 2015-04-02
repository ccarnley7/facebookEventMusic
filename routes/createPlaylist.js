var express = require('express');
var request = require('request');
var http = require('http');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    /*http.get('https://api.spotify.com/v1/me')

    request.post(
        'https://api.spotify.com/v1/users/{user_id}/playlists',
        { form: { key: 'value' } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
        }
    );
    request.get()*/
    res.send("test")
});

module.exports = router;
