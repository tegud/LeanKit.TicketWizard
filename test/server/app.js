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
                expect(actualBoardId).to.be(1234);
                done();
            });
    });

    it('creates a new ticket in to the default lane for the specified team', function(done) {
        request(server)
            .post('/Team/Standard/create')
            .end(function() {
                expect(actualLaneId).to.be(5678);
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
                expect(actualLaneId).to.be(91011);
                done();
            });
    });

    it('creates a new ticket with the specified team\'s default card type', function(done) {
        request(server)
            .post('/Team/Standard/create')
            .end(function() {
                expect(actualNewCard.TypeId).to.be(121314);
                done();
            });
    });

    it('creates a new ticket with a default card size of 0', function(done) {
        request(server)
            .post('/Team/Standard/create')
            .end(function() {
                expect(actualNewCard.Size).to.be(0);
                done();
            });
    });

    it('creates a new ticket with the specified details', function(done) {
        request(server)
            .post('/Team/Standard/create')
            .send({
                typeId: 15161718,
                title: 'Card Title',
                size: 3,
                tags: ['One', 'Two'],
                description: {
                    test: 'Something Else'
                }
            })
            .end(function() {
                expect(actualNewCard).to.eql({
                    TypeId: 15161718,
                    Title: 'Card Title',
                    Description: '<div>Something = Something Else</div>',
                    Size: 3,
                    Tags: 'One,Two',
                    Priority: 1,
                    IsBlocked: false,
                    BlockReason: '',
                    DueDate: '',
                    ExternalSystemName: '',
                    ExternalSystemUrl: '',
                    ClassOfServiceId: null,
                    ExternalCardId: '',
                    AssignedUserIds: []
                });
                done();
            });
    });
});
 