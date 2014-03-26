var fs = require('fs');
var async = require('async');

module.exports = {
    readFileAsUtf8: function (file, callback) {
        return fs.readFile(file, { encoding: 'utf-8' }, callback);
    },
    getFolders: function getFolders(dir, callback) {
        async.waterfall([
            fs.readdir.bind(undefined, dir),
            function(files, callback) {
                async.filter(files, function(file, callback) {
                    fs.stat(dir + '/' + file, function(err, fileInfo) {
                        callback(!err && fileInfo.isDirectory());
                    });
                }, callback.bind(undefined, null));
            },
        ],
        callback);
    },
    File: function (fileName) {
        var startOfExtension = fileName.lastIndexOf('.');
        var fileNameText = fileName.substring(0, startOfExtension);
        var fileExtension;

        if(startOfExtension > -1) {
            fileExtension = fileName.substring(startOfExtension + 1);
        }

        return {
            extension: function() {
                return fileExtension;
            },
            fileName: function() {
                return fileNameText;
            },
            fullFileName: function() {
                return fileName;
            }
        };
    }
};
