var request = require('supertest');
var proxyquire = require('proxyquire').noCallThru();
var app = proxyquire('../index', {
    'leankit-client': {
        newClient: function() {
            return {
                getCard: function(board, ticket, callback) {
                    callback(null, {
                        Title: 'Test Item'
                    });
                }
            };
        }
    }
});

describe.skip('TicketWizard', function () {
    var server;
    var theApp;

    beforeEach(function(done) {
        theApp = new app();
        theApp.start({
            root: '/test/data'
        }, function(err, httpServer) {
            server = httpServer;
            done();
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

    it('loads populated ticket entry form for specified team and form with ticket information', function(done) {
        request(server)
            .get('/Team/Standard/12345')
            .expect(200)
            .expect('Content-Type', /html/)
            .expect(/Test Item/)
            .end(done);
    });
});