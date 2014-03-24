var express = require('express');
var http = require('http');
var hbs = require('hbs');
var handlebars = hbs.handlebars;
var fs = require('fs');
var _ = require('lodash');
var async = require('async');
var buildFormViewModel = require('./lib/FormViewModel');
var Components = require('./lib/Components');
var AppServer = require('./lib/AppServer');
var leanKitClientBuilder = require('./lib/LeanKit/ClientBuilder');

function readFileAsUtf8(file, callback) {
    return fs.readFile(file, { encoding: 'utf-8' }, callback);
}

function getFolders(dir, callback) {
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

function readTeamFolder(folder, callback) {
    async.waterfall([
        function(callback) {
            fs.readdir(folder, callback);
        },
        function(files, callback) {
            async.reduce(files, {}, function(memo, file, callback) {
                var startOfExtension = file.indexOf('.');

                if(startOfExtension > -1 && file === 'board.json') {
                    memo.hasBoardMetaData = true;
                }
                else if (startOfExtension > -1) {
                    var formName = file.substring(0, startOfExtension);
                    var fileExtension = file.substring(startOfExtension + 1);

                    if(!memo[formName]) {
                        memo[formName] = {};
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
            callback(null, teamMetaData);
        }
    ], callback);
}

var teams = (function() {

    var teams = {};

    return {
        loadFromDir: function(teamDir, callback) {
            async.waterfall([
                function(callback) {
                    getFolders(teamDir, callback);
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
})();

var server = function() {
    var app = express();
    var dataRoot;
    var clientBuilder;
    var httpServer;

    app.set('view engine', 'html');
    app.engine('html', hbs.__express);

    app.use(express.json());
    app.use("/static", express.static(__dirname + '/static'));

    app.post('/:team/:form/create', function(req, res) {
        var client = clientBuilder();
        var boardId = 91399429;
        var insertIntoLaneId = 91557453;
        var cardTypeId = 91551782;

        fs.readFile(__dirname + '/teams/' + req.params.team + '/' + req.params.form + '.hbs', { encoding: 'utf-8' }, function(err, fileContents) {
            var template = handlebars.compile(fileContents);
            var description = template(req.body.description);

            var testCard = {
                Title: req.body.title,
                Description: description,
                TypeId: cardTypeId,
                Priority: 1,
                Size: req.body.size || 0,
                IsBlocked: false,
                BlockReason: '',
                DueDate: '',
                ExternalSystemName: '',
                ExternalSystemUrl: '',
                Tags: req.body.tags.join(','),
                ClassOfServiceId: null,
                ExternalCardId: '',
                AssignedUserIds: []
            };

            client.addCard(boardId, insertIntoLaneId, 0, testCard, function(err, newCard) { 
                res.end(err);
            });
        });
    });

    app.post('/:team/:form/update/:id', function(req, res) {
        var client = clientBuilder();
        var path = __dirname + '/teams/' + req.params.team + '/' + req.params.form + '.hbs';

        fs.readFile(path, { encoding: 'utf-8' }, function(err, fileContents) {
            var template = handlebars.compile(fileContents);
            var description = template(req.body.description);

            client.updateCardFields({
                CardId : req.params.id,
                Title: req.body.title,
                Tags: req.body.tags.join(','),
                Description: description
            }, function(err, cardResp){
                res.end(err);
            });
        });
    });

    var displayForm = function(req, res) {
        var url = {
            team: req.params.team,
            form: req.params.form,
            ticketId: req.params.ticketId
        };

        var render = function(card) {
            var path = __dirname + dataRoot + '/' + url.team + '/' + url.form + '.json';

            fs.readFile(path, { encoding: 'utf-8' }, function(err, fileContents) {
                if(err) {
                    res.end('Form or Team not found');
                    return;
                }

                var data = JSON.parse(fileContents);

                data.url = url;

                buildFormViewModel(data, function(err, viewModel) {
                    res.render('index.hbs', viewModel);
                });
            });
        };

        if(url.ticketId) {
            var client = clientBuilder();
            var boardId = 91399429;

            client.getCard(boardId, url.ticketId, function(err, card) {
                render(card);
            });
        }
        else {
            render();
        }
    };

    app.get('/:team/:form/:ticketId', displayForm);
    app.get('/:team/:form', displayForm);

    return {
        start: function(options, callback) {
            var components = new Components();
            var setUpLeanKitClientBuilder = function(path) {
                return function(callback) {
                    leanKitClientBuilder.buildFromPath(path, function(builder) {
                        clientBuilder = builder;
                        callback();
                    });
                };
            };

            dataRoot = options.root || '/teams';
            httpServer = new AppServer(app, options);

            async.parallel([
                components.registerDir(__dirname + '/views/partials'),
                setUpLeanKitClientBuilder(__dirname + '/credentials.json'),
                httpServer.start,
                function(callback) {
                    teams.loadFromDir(__dirname + '/teams', callback);
                }
            ],
            function(err, results) {
                (callback || function() {})(err, results[2]);
            });
        },
        stop: function(callback) {
            httpServer.stop(callback);
        }
    };
};

if(require.main === module) {
    new server().start({
        port: 3001
    });
}

module.exports = server;