var express = require('express');
var http = require('http');
var hbs = require('hbs');
var handlebars = hbs.handlebars;
var LeanKitClient = require('leankit-client');
var fs = require('fs');
var _ = require('lodash');
var buildFormViewModel = require('./lib/FormViewModel');

var server = function() {
    var httpServer;
    var app = express();
    var dataRoot;

    app.set('view engine', 'html');
    app.engine('html', hbs.__express);

    app.use(express.json());
    app.use("/static", express.static(__dirname + '/static'));

    app.post('/:team/:form/create', function(req, res) {
        var client = LeanKitClient.newClient('tlrg', 'steve.elliot@laterooms.com', '10Six12');
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
        var client = LeanKitClient.newClient('tlrg', 'steve.elliot@laterooms.com', '10Six12');
        var boardId = 91399429;
        var insertIntoLaneId = 91557453;
        var cardTypeId = 91551782;

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
            var path = __dirname + dataRoot + '/' + team + '/' + form + '.json';
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
            var client = LeanKitClient.newClient('tlrg', 'steve.elliot@laterooms.com', '10Six12');
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
        start: function(options, callback) {var hbs = require('hbs');
            dataRoot = options.root || '/teams';

            var components = {};
            var partialsDir = __dirname + '/views/partials';
            var filenames = fs.readdirSync(partialsDir);

            filenames.forEach(function (filename) {
                var matches = /^([^.]+).hbs$/.exec(filename);
                if (!matches) {
                    return;
                }
                var name = matches[1];
                var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
                components[name] = hbs.handlebars.compile(template);
            });

            hbs.registerHelper('renderComponent', function (name) {
                var componentTemplate = components[name];
                if(!componentTemplate) {
                    return;
                }
                return new hbs.handlebars.SafeString(componentTemplate(this));
            });

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