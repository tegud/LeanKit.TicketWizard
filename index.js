'use strict';

var express = require('express');
var http = require('http');
var hbs = require('hbs');
var LeanKitClient = require('leankit-client');

var server = function() {
    var httpServer;

    var app = express();

    app.set('view engine', 'html');
    app.engine('html', hbs.__express);

    app.use("/static", express.static(__dirname + '/static'));

    app.use('/create', function(req, res) {
        var client = LeanKitClient.newClient('lrtest', 'steve.elliot@laterooms.com', '10Six12');
        var boardId = 91399429;
        var insertIntoLaneId = 91557453;
        var cardTypeId = 91551782;
        var boardIdentifiers;
        
        var testCard = {
            Title: 'Test Request',
            Description: '',
            TypeId: cardTypeId,
            Priority: 1,
            Size: 0,
            IsBlocked: false,
            BlockReason: '',
            DueDate: '',
            ExternalSystemName: '',
            ExternalSystemUrl: '',
            Tags: '',
            ClassOfServiceId: null,
            ExternalCardId: '',
            AssignedUserIds: []
        };

        client.getBoardIdentifiers(boardId, function(err, boardRes) {
            console.log(boardRes);
        });

        client.addCard(boardId, insertIntoLaneId, 0, testCard, function(err, newCard) { 
            console.log(err);
            console.log(newCard);
            res.end(err);
        });
    });

    app.use('/', function(req, res) {
        res.render('index.hbs');
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
        port: 3000
    });
}

module.exports = server;