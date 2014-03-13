var express = require('express');
var http = require('http');
var hbs = require('hbs');
var handlebars = hbs.handlebars;
var LeanKitClient = require('leankit-client');
var fs = require('fs');
var _ = require('lodash');
var BuildFormViewModel = require('./lib/FormViewModelFactory');

var server = function() {
    var httpServer;
    var app = express();
    
    var boardId = 32482312;
    var insertIntoLaneId = 94256017;
    var cardTypeId = 32482635;

    app.set('view engine', 'html');
    app.engine('html', hbs.__express);

    app.use(express.json());
    app.use("/static", express.static(__dirname + '/static'));

    app.post('/:team/:form/create', function(req, res) {
        var client = LeanKitClient.newClient('lrtest', 'steve.elliot@laterooms.com', '10Six12');
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

    app.post('/:team/:form/update/:id', function(req, res) {
        var client = LeanKitClient.newClient('lrtest', 'steve.elliot@laterooms.com', '10Six12');

        fs.readFile(__dirname + '/teams/' + req.params.team + '/' + req.params.form + '.hbs', { encoding: 'utf-8' }, function(err, fileContents) {
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
            fs.readFile(__dirname + '/teams/' + team + '/' + form + '.json', { encoding: 'utf-8' }, function(err, fileContents) {
                if(err) {
                    res.end('Form or Team not found');
                    return;
                }

                var data = JSON.parse(fileContents);
                var viewModel = BuildFormViewModel(team, form, data, card);
                res.render('index.hbs', viewModel);
            });
        };

        if(ticketId) {
            var client = LeanKitClient.newClient('lrtest', 'steve.elliot@laterooms.com', '10Six12');

            client.getCard(boardId, ticketId, function(err, card) {
                render(card);
            });
        }
        else {
            render();
        }
    };

    app.get('/:team/:form', displayForm);
    app.get('/:team/:form/:ticketId', displayForm);

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