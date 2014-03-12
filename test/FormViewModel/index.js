var expect = require('expect.js');
var buildForm = require('../../lib/FormViewModel');

describe('FormViewModel', function () {
    it('sets the Title component', function (done) {
        buildForm({
            sections: [{ fields: [{ type: "Title" }] }]
        }, function(err, viewModel) {
            expect(viewModel).to.eql({
                "sections": [
                    {
                        "fields": [
                            {
                                "type": "Title",
                                "label": "Title"
                            }
                        ]
                    }
                ]
            });

            done();
        });
    });
});