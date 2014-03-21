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
            title: 'PageTitle',
            sections: []
        }, function(err, viewModel) {
            expect(viewModel).to.eql({
                title: 'PageTitle',
                sections: []
            });

            done();
        });
    });

    it('sets the Title component', function (done) {
        buildForm({
            sections: [{ fields: [{
                type: "text"
            }] }]
        }, function(err, viewModel) {
            expect(viewModel).to.eql({
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
            sections: [{ fields: [{
                type: "table"
            }] }]
        }, function(err, viewModel) {
            expect(viewModel).to.eql({
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