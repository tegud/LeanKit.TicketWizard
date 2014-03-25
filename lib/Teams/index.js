var async = require('async');
var fsUtil = require('../fsUtils');
var fs = require('fs');
var _ = require('lodash');

var teams = {};

function readTeamFolder(folder, callback) {
    async.waterfall([
        function(callback) {
            fs.readdir(folder, callback);
        },
        function(files, callback) {
            async.reduce(files, {
                forms: []
            }, function(memo, file, callback) {
                var startOfExtension = file.indexOf('.');

                if(startOfExtension > -1 && file === 'board.json') {
                    memo.hasBoardMetaData = true;
                }
                else if (startOfExtension > -1) {
                    var formName = file.substring(0, startOfExtension);
                    var fileExtension = file.substring(startOfExtension + 1);

                    if(!memo[formName]) {
                        memo[formName] = {};
                        memo.forms.push(formName);
                    }

                    if(fileExtension === 'hbs') {
                        memo[formName].hasTemplate = true;
                    }
                    else if (fileExtension === 'json'){
                        memo[formName].hasFormData = true;
                    }
                }

                callback(null, memo);
            }, callback);
        },
        function(teamMetaData, callback) {
            if(!teamMetaData.hasBoardMetaData) {
                callback('Team ' + folder + ' has no board.json file.');
            }

            _.each(teamMetaData.forms, function(form) {
                if(!teamMetaData[form].hasTemplate) {
                    callback('Team ' + folder + ', ' + form + ' has a missing template');
                }

                if(!teamMetaData[form].hasFormData) {
                    callback('Team ' + folder + ', ' + form + ' has a missing json file');
                }
            });

            callback(null, teamMetaData);
        },
        function(teamMetaData, callback) {
            fsUtil.readFileAsUtf8(folder + '/board.json', function(err, data) {
                teamMetaData.board = JSON.parse(data);
                callback(err, teamMetaData);
            });
        }
    ], callback);
}

module.exports = {
    loadFromDir: function(teamDir, callback) {
        async.waterfall([
            function(callback) {
                fsUtil.getFolders(teamDir, callback);
            },
            function(folders, callback) {
                async.map(folders, function(folder, callback) {
                    readTeamFolder(teamDir + '/' + folder, function(err, data) {
                        teams[folder] = data;
                        callback();
                    });
                }, callback);
            },
            function(data, callback) {
                console.log(teams);
                callback();
            }
        ], callback);
    }
};
