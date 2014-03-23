var expect = require('expect.js');
var proxyquire = require('proxyquire');

var buildForm = proxyquire ('../../../lib/FormViewModel', {
    './components': {
        'text': function(config, callback) {
            if(!callback) {
                callback = config;
            }

            callback(null, { type: 'textField' });
        },
        'table': function(config, callback) {
            if(!callback) {
                callback = config;
            }

            callback(null, { type: 'table' });
        }
    }
});

describe('FormViewModel', function () {
    it('sets the page title', function(done) {
        buildForm({
            url: {},
            title: 'PageTitle',
            sections: []
        }, function(err, viewModel) {
            expect(viewModel.title).to.eql('PageTitle');

            done();
        });
    });

    it('sets the page post url', function(done) {
        buildForm({
            url: {
                team: 'test',
                form: 'one'
            },
            sections: []
        }, function(err, viewModel) {
            expect(viewModel.postToUrl).to.eql('/test/one/create');

            done();
        });
    });

    it('sets the Title component', function (done) {
        buildForm({
            url: {
                team: 'test',
                form: 'one'
            },sections: [{ fields: [{
                type: "text"
            }] }]
        }, function(err, viewModel) {
            expect(viewModel).to.eql({
                postToUrl: '/test/one/create',
                sections: [
                    {
                        fields: [ { type: "textField" } ]
                    }
                ]
            });

            done();
        });
    });

    it('sets the table components', function(done) {
        buildForm({
            url: {
                team: 'test',
                form: 'one'
            },sections: [{ fields: [{
                type: "table"
            }] }]
        }, function(err, viewModel) {
            expect(viewModel).to.eql({
                postToUrl: '/test/one/create',
                sections: [
                    {
                        fields: [ { type: "table" } ]
                    }
                ]
            });

            done();
        });
    });
});