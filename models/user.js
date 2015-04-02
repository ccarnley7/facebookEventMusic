var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
    userID: String,
    accessToken: String,
    refreshToken: String,
    provider: String,
    name: String
});