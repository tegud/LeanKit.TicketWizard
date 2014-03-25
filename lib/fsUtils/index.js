var fs = require('fs');
var async = require('async');

module.exports = {
    readFileAsUtf8: function (file, callback) {
        return fs.readFile(file, { encoding: 'utf-8' }, callback);
    },
    getFolders: function getFolders(dir, callback) {
        async.waterfall([
            function(callback) {
                fs.readdir(dir, callback);
            },
            function(files, callback) {
                async.filter(files, function(file, callback) {
                    fs.stat(dir + '/' + file, function(err, fileInfo) {
                        callback(!err && fileInfo.isDirectory());
                    });
                }, function(folders) {
                    callback(null, folders);
                });
            },
        ],
        callback);
    }
};
