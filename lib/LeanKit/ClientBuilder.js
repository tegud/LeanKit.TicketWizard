var async = require('async');
var LeanKitClient = require('leankit-client');
var fsUtils = require('../fsUtils');

module.exports = {
    buildFromPath: function(filePath, callback) {
        async.waterfall([
            function(callback) {
                fsUtils.readFileAsUtf8(filePath, callback);
            },
            function(data, callback) {
                var credentials = JSON.parse(data);

                callback(null, new LeanKitClient.newClient(credentials.organisation, credentials.username, credentials.password));
            }
        ],
        callback);
    }
};
