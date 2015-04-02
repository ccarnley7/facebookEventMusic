var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
   /* request.post(
        'https://api.spotify.com/v1/users/{user_id}/playlists',
        { form: { key: 'value' } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
        }
    );*/
    res.send("test")
});

module.exports = router;
