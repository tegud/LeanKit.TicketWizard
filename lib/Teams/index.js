var async = require('async');
var fs = require('fs');
var fsUtil = require('../fsUtils');
var File = fsUtil.File;
var _ = require('lodash');
var buildFormViewModel = require('../FormViewModel');
var MetaData = require('./MetaData');
var handlebars = require('hbs').handlebars;

var viewModelCache = {};
var teams = {};
var root;

function fileIsBoardData(file) {
    return file.fullFileName() === 'board.json';
}

function readTeamFolder(folder, callback) {
    async.waterfall([
        fs.readdir.bind(undefined, folder),
        function(files, callback) {
            async.reduce(files,
            new MetaData(folder),
            function(metaData, fileName, callback) {
                var file = new File(fileName);

                if(fileIsBoardData(file)) {
                    metaData.hasBoardData();
                }
                else if (file.extension()) {
                    metaData.hasFile(file);
                }

                callback(null, metaData);
            }, callback);
        },
        function(teamMetaData, callback) {
            teamMetaData.validate(function(error) {
                callback(error, teamMetaData);
            });
        },
        function(teamMetaData, callback) {
            fsUtil.readFileAsUtf8(folder + '/board.json', function(err, data) {
                teamMetaData.setBoardData(JSON.parse(data));

                callback(err, teamMetaData);
            });
        }
    ], callback);
}

function readTeamFolderContents(teamDir) {
    return function(folders, callback) {
        callback(null, _.map(folders, function(folder) {
            return function(callback) {
                readTeamFolder(teamDir + '/' + folder, function(err, data) {
                    teams[folder] = data;
                    callback(err);
                });
            };
        }));
    };
}

module.exports = {
    setRoot: function(rootPath) {
        root = rootPath;
    },
    loadFromDir: function(callback) {
        async.waterfall([
            fsUtil.getFolders.bind(undefined, root),
            readTeamFolderContents(root),
            async.parallel
        ], callback);
    },
    getBoardDataForTeam: function(team) {
        return teams[team].get().board;
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
                callback(err, viewModelCache[path]);
            });
        });
    },
    getTicketTemplateForUrl: function(url, callback) {
        var path = root + '/' + url.team + '/' + url.form + '.hbs';

        async.waterfall([
            fsUtil.readFileAsUtf8.bind(undefined, path),
            function(templateContents, callback) {
                callback(null, handlebars.compile(templateContents));
            }
        ], callback);
    }
};
