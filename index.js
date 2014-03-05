'use strict';

var express = require('express');
var http = require('http');
var hbs = require('hbs');
var handlebars = hbs.handlebars;
var LeanKitClient = require('leankit-client');
var fs = require('fs');
var _ = require('lodash');
var buildFormViewModel = require('./lib/FormViewModelFactory');

var server = function() {
    var httpServer;

    var app = express();

    app.set('view engine', 'html');
    app.engine('html', hbs.__express);

    app.use(express.json());

    app.use("/static", express.static(__dirname + '/static'));

    app.post('/:team/:form/create', function(req, res) {
        var client = LeanKitClient.newClient('lrtest', 'steve.elliot@laterooms.com', '10Six12');
        var boardId = 91399429;
        var insertIntoLaneId = 91557453;
        var cardTypeId = 91551782;
        var boardIdentifiers;

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

    app.get('/:team/:form', function(req, res) {
        var team = req.params.team;
        var form = req.params.form;

        fs.readFile(__dirname + '/teams/' + team + '/' + form + '.json', { encoding: 'utf-8' }, function(err, fileContents) {
            if(err) {
                res.end('Form or Team not found');
                return;
            }

            var data = JSON.parse(fileContents);
            var viewModel = buildFormViewModel(team, form, data);
            res.render('index.hbs', viewModel);
        });
    });

    return {
        start: function(options, callback) {
            httpServer = http.createServer(app);
            httpServer.listen(options.port, function() {
                if(callback) {
                    callback(undefined, httpServer);
                }
            });
        },
        stop: function(callback) {
            httpServer.close(callback);
        }
    };
};

if(require.main === module) {
    new server().start({
        port: 3001
    });
}

module.exports = server;