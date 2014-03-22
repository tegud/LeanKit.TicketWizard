var async = require('async');
var LeanKitClient = require('leankit-client');
var fs = require('fs');

module.exports = {
    buildFromPath: function(filePath, callback) {
        async.waterfall([
            function(callback) {
                fs.readFile(filePath, 'utf8', callback);
            },
            function(data, callback) {
                var credentials = JSON.parse(data);

                callback(null, function () {
                    return LeanKitClient.newClient(credentials.organisation, credentials.username, credentials.password);
                });
            }
        ],
            callback);
    }
};
