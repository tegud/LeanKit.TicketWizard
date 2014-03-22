var express = require('express');
var http = require('http');
var hbs = require('hbs');
var handlebars = hbs.handlebars;
var LeanKitClient = require('leankit-client');
var fs = require('fs');
var _ = require('lodash');
var async = require('async');
var buildFormViewModel = require('./lib/FormViewModel');

var Components = function() {
    var components = {};

    hbs.registerHelper('renderComponent', function (name) {
        var componentTemplate = components[name];
        if(!componentTemplate) {
            return;
        }
        return new hbs.handlebars.SafeString(componentTemplate(this));
    });

    return {
        registerDir: function(partialsDir) {
            return function(callback) {
                async.waterfall([
                    function(callback) {
                        callback(null, partialsDir);
                    },
                    fs.readdir,
                    function(filenames, callback) {
                        async.each(filenames, function(filename, callback) {
                            var matches = /^([^.]+).hbs$/.exec(filename);
                            if (!matches) {
                                return;
                            }
                            var name = matches[1];
                            fs.readFile(partialsDir + '/' + filename, 'utf8', function(err, template) {
                                components[name] = hbs.handlebars.compile(template);
                                callback();
                            });
                        }, callback);
                    }
                ], callback);
            };
        }
    };
};

var leanKitClientBuilder = (function() {
    return {
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
})();

var AppServer = function(app, options) {
    var httpServer = http.createServer(app);

    return {
        start: function(callback) {
            httpServer.listen(options.port, function(err) {
                console.log('start');
                callback(err, httpServer);
            });
        },
        stop: function(callback) {
            httpServer.close(callback);
        }
    };
};

var server = function() {
    var app = express();
    var dataRoot;
    var credentials;
    var clientBuilder;
    var httpServer;
    var stop = function(callback) {
        console.log('hello');
        httpServer.stop(callback);
    };

    app.set('view engine', 'html');
    app.engine('html', hbs.__express);

    app.use(express.json());
    app.use("/static", express.static(__dirname + '/static'));

    app.post('/:team/:form/create', function(req, res) {
        var client = LeanKitClient.newClient(credentials.organisation, credentials.username, credentials.password);
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
        var client = LeanKitClient.newClient(credentials.organisation, credentials.username, credentials.password);
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
                console.log(cardResp);
                res.end(err);
            });
        });
    });

    var displayForm = function(req, res) {
        var team = req.params.team;
        var form = req.params.form;
        var ticketId = req.params.ticketId;

        var render = function(card) {
            var path = __dirname + dataRoot + '/' + team + '/' + form + '.json';

            console.log(path);

            fs.readFile(path, { encoding: 'utf-8' }, function(err, fileContents) {
                if(err) {
                    res.end('Form or Team not found');
                    return;
                }

                var data = JSON.parse(fileContents);
                buildFormViewModel(data, function(err, viewModel) {
                    res.render('index.hbs', viewModel);
                });
            });
        };

        if(ticketId) {
            var client = LeanKitClient.newClient(credentials.organisation, credentials.username, credentials.password);
            var boardId = 91399429;

            client.getCard(boardId, ticketId, function(err, card) {
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
            var setUpLeanKitClientBuilder = function(callback) {
                leanKitClientBuilder.buildFromPath(__dirname + '/credentials.json', function(builder) {
                    clientBuilder = builder;
                    callback();
                });
            };

            dataRoot = options.root || '/teams';
            httpServer = new AppServer(app, options);

            async.waterfall([
                components.registerDir(__dirname + '/views/partials'),
                setUpLeanKitClientBuilder,
                httpServer.start
            ],
            function(err, results) {
                callback(err, results);
            });
        },
        stop: stop
    };
};

if(require.main === module) {
    new server().start({
        port: 3001
    });
}

module.exports = server;