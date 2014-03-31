var expect = require('expect.js');
var request = require('supertest');
var proxyquire = require('proxyquire').noCallThru();

var actualBoardId;
var actualLaneId;
var actualNewCard;

var app = proxyquire('../../index', {
    './lib/LeanKit/ClientBuilder': {
        buildFromPath: function(path, callback) {
            callback(null, {
                getCard: function(board, ticket, callback) {
                    callback(null, {
                        Title: 'Test Item'
                    });
                },
                addCard: function(boardId, insertIntoLaneId, position, card, callback) {
                    actualBoardId = boardId;
                    actualLaneId = insertIntoLaneId;
                    actualNewCard = card;

                    callback(null, card);
                }
            });
        }
    }
});

describe('TicketWizard', function () {
    var server;
    var theApp;

    beforeEach(function(done) {
        actualBoardId = null;
        actualLaneId = null;
        actualNewCard = null;

        theApp = new app();
        theApp.start({
            root: '/test/server/data'
        }, function(err, httpServer) {
            server = httpServer;
            done(err);
        });
    });

    afterEach(function(done) {
        theApp.stop(done);
    });

    it('loads blank ticket entry form for specified team and form.', function (done) {
        request(server)
            .get('/Team/Standard')
            .expect(200)
            .expect('Content-Type', /html/)
            .expect(/Test Ticket Form/)
            .end(done);
    });

    it('creates a new ticket on the board for the specified team', function(done) {
        request(server)
            .post('/Team/Standard/create')
            .end(function() {
                expect(actualBoardId).to.eql(1234);
                done();
            });
    });

    it('creates a new ticket in to the default lane for the specified team', function(done) {
        request(server)
            .post('/Team/Standard/create')
            .end(function() {
                expect(actualLaneId).to.eql(5678);
                done();
            });
    });

    it('creates a new ticket in the specified lane', function(done) {
        request(server)
            .post('/Team/Standard/create')
            .send({
                laneId: 91011
            })
            .end(function() {
                expect(actualLaneId).to.eql(91011);
                done();
            });
    });

    it('creates a new ticket with the specified team\'s default card type', function(done) {
        request(server)
            .post('/Team/Standard/create')
            .end(function() {
                expect(actualNewCard.TypeID).to.eql(121314);
                done();
            });
    });

    it('creates a new ticket with the specified typeId', function(done) {
        request(server)
            .post('/Team/Standard/create')
            .send({
                typeId: 15161718
            })
            .end(function() {
                expect(actualNewCard.TypeID).to.eql(15161718);
                done();
            });
    });

});
 