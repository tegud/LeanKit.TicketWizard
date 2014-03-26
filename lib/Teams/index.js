var async = require('async');
var fsUtil = require('../fsUtils');
var fs = require('fs');
var _ = require('lodash');
var buildFormViewModel = require('../FormViewModel');

var viewModelCache = {};
var teams = {};
var root;

function cleanUpMetaData(metaData) {
    delete metaData.formValidators;
    delete metaData.hasBoardMetaData;
}

function readTeamFolder(folder, callback) {
    async.waterfall([
        function(callback) {
            fs.readdir(folder, callback);
        },
        function(files, callback) {
            async.reduce(files, {
                forms: [],
                formValidators: {}
            }, function(memo, file, callback) {
                var startOfExtension = file.indexOf('.');

                if(startOfExtension > -1 && file === 'board.json') {
                    memo.hasBoardMetaData = true;
                }
                else if (startOfExtension > -1) {
                    var formName = file.substring(0, startOfExtension);
                    var fileExtension = file.substring(startOfExtension + 1);

                    if(!memo.formValidators[formName]) {
                        memo.formValidators[formName] = {};
                        memo.forms.push(formName);
                    }

                    if(fileExtension === 'hbs') {
                        memo.formValidators[formName].hasTemplate = true;
                    }
                    else if (fileExtension === 'json'){
                        memo.formValidators[formName].hasFormData = true;
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
                if(!teamMetaData.formValidators[form].hasTemplate) {
                    callback('Team ' + folder + ', ' + form + ' has a missing template');
                }

                if(!teamMetaData.formValidators[form].hasFormData) {
                    callback('Team ' + folder + ', ' + form + ' has a missing json file');
                }
            });

            callback(null, teamMetaData);
        },
        function(teamMetaData, callback) {
            fsUtil.readFileAsUtf8(folder + '/board.json', function(err, data) {
                teamMetaData.board = JSON.parse(data);

                cleanUpMetaData(teamMetaData);

                callback(err, teamMetaData);
            });
        }
    ], callback);
}

function createFolderTasks(teamDir) {
    return function(folders, callback) {
        callback(null, _.map(folders, function(folder) {
            return function(callback) {
                readTeamFolder(teamDir + '/' + folder, function(err, data) {
                    teams[folder] = data;
                    callback();
                });
            };
        }));
    };
}

function getListOfFolders(teamDir) {
    return function(callback) {
        fsUtil.getFolders(teamDir, callback);
    };
}

module.exports = {
    setRoot: function(rootPath) {
        root = rootPath;
    },
    loadFromDir: function(teamDir, callback) {
        async.waterfall([
            getListOfFolders(teamDir),
            createFolderTasks(teamDir),
            async.parallel
        ], callback);
    },
    getTemplateForUrl: function(url, callback) {
        var path = root + '/' + url.team + '/' + url.form + '.json';

        if(viewModelCache[path]) {
            callback(null, viewModelCache[path])
        }

        fsUtil.readFileAsUtf8(path, function(err, fileContents) {
            var data = JSON.parse(fileContents);

            data.url = url;

            buildFormViewModel(data, function(err, viewModel) {
                viewModelCache[path] = viewModel;
                console.log(viewModel);
                callback(err, viewModelCache[path]);
            });
        });
    }
};
