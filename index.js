var express = require('express');
var hbs = require('hbs');
var handlebars = hbs.handlebars;
var _ = require('lodash');
var async = require('async');
var Components = require('./lib/Components');
var AppServer = require('./lib/AppServer');
var leanKitClientBuilder = require('./lib/LeanKit/ClientBuilder');
var TicketBuilder = require('./lib/LeanKit/TicketBuilder');
var fsUtil = require('./lib/fsUtils');
var teams = require('./lib/Teams');
var cheerio = require('cheerio');
var toCamelCase = require('./lib/stringUtils').toCamelCase;

var server = function() {
    var app = express();
    var clientBuilder;
    var httpServer;
    var credentialsPath = __dirname + '/credentials.json';

    var displayForm = function(req, res) {
        var url = {
            team: req.params.team,
            form: req.params.form,
            ticketId: req.params.ticketId
        };

        var cardPropertyMappings = {
            'title': 'Title',
            'description': 'Description'
        };

        var parseDescription = function(description) {
            var $ = cheerio.load(description);
            var descriptionFieldValues = {};

            $('.dv').each(function() {
                var fieldValueElement = this;
                var fieldValueName = toCamelCase(fieldValueElement.data('dv'));

                descriptionFieldValues[fieldValueName] = this.html();
            });

            return descriptionFieldValues;
        };

        var render = function(card) {
            teams.getViewModelForUrl(url, function(err, viewModel) {
                if(err) {
                    res.end('Form or Team not found');
                    return;
                }

                if(card) {
                    parseDescription(card.Description);

                    _.each(viewModel.sections, function(section) {
                        _.each(section.fields, function(field) {
                            var appendTo = field.appendTo || 'description';
                            var fillpoint = field.fillpoint;
                            var cardValue = card[cardPropertyMappings[appendTo]];

                            if(cardValue && appendTo === 'description') {
                                cardValue = descriptionFieldValues[fillpoint];
                            }

                            if(cardValue) {
                                field.setValue(cardValue);
                            }
                        });
                    });
                }

                res.render('index.hbs', viewModel);
            });
        };

        if(url.ticketId) {
            leanKitClientBuilder.buildFromPath(credentialsPath, function(err, client) {
                var boardId = 91399429;

                client.getCard(boardId, url.ticketId, function(err, card) {
                    render(card);
                });
            });
        }
        else {
            render();
        }
    };

    app.set('view engine', 'html');
    app.engine('html', hbs.__express);

    app.use(express.json());
    app.use("/static", express.static(__dirname + '/static'));

    app.post('/:team/:form/create', function(req, res) {
        var url = {
            team: req.params.team,
            form: req.params.form,
            ticketId: req.params.ticketId
        };
        var boardMetaData = teams.getBoardDataForTeam(url.team);
        var ticketBuilder = new TicketBuilder({
            url: url,
            boardMetaData: boardMetaData
        });

        function setUpClient(ticket, callback) {
            leanKitClientBuilder.buildFromPath(credentialsPath, function(err, client) {
                callback(err, client, ticket);
            });
        }

        function createTicketInLeanKit(client, ticket, callback) {
            client.addCard(boardMetaData.boardId, req.body.laneId || boardMetaData.laneId, 0, ticket, callback);
        }

        async.waterfall([
            ticketBuilder.create.bind(undefined, req.body),
            setUpClient,
            createTicketInLeanKit
        ],
        function(err, resp) {
            res.end('Hello');
        });
    });

    app.post('/:team/:form/update/:id', function(req, res) {
        var client = clientBuilder();
        var path = __dirname + '/teams/' + req.params.team + '/' + req.params.form + '.hbs';

        fsUtil.readFileAsUtf8(path, function(err, fileContents) {
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

    app.get('/:team/:form/:ticketId', displayForm);
    app.get('/:team/:form', displayForm);

    return {
        start: function(options, callback) {
            var components = new Components();
            var setUpLeanKitClientBuilder = function(path, callback) {
                leanKitClientBuilder.buildFromPath(path, function(builder) {
                    clientBuilder = builder;
                    callback();
                });
            };

            teams.setRoot(__dirname + (options.root || '/teams'));
            httpServer = new AppServer(app, options);

            async.parallel([
                components.registerDir(__dirname + '/views/partials'),
                setUpLeanKitClientBuilder.bind(undefined, credentialsPath),
                httpServer.start,
                teams.loadFromDir
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