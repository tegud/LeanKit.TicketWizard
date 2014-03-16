var expect = require('expect.js');
var proxyquire = require('proxyquire');

var buildForm = proxyquire ('../../lib/FormViewModel', {
    './components': {
        'text': function(config, callback) {
            if(!callback) {
                callback = prefix;
            }

            callback(null, { type: 'textField' });
        },
        'table': function(config, callback) {
            if(!callback) {
                callback = prefix;
            }

            callback(null, { type: 'table' });
        }
    }
});

describe('FormViewModel', function () {
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