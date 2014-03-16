var expect = require('expect.js');
var buildForm = require('../../lib/FormViewModel');

describe('FormViewModel', function () {
    it('sets the Title component', function (done) {
        buildForm({
            sections: [{ fields: [{
                type: "text",
                label: "Title"
            }] }]
        }, function(err, viewModel) {
            expect(viewModel).to.eql({
                sections: [
                    {
                        fields: [
                            {
                                label: "Title",
                                inputType: "textField",
                                appendTo: "description"
                            }
                        ]
                    }
                ]
            });

            done();
        });
    });

    it('sets the table components', function(done) {
        buildForm({
            sections: [{ fields: [{
                type: "table",
                label: "Requirements"
            }] }]
        }, function(err, viewModel) {
            expect(viewModel).to.eql({
                sections: [
                    {
                        fields: [
                            {
                                label: "Requirements",
                                inputType: "table",
                                appendTo: "description",
                                rows: []
                            }
                        ]
                    }
                ]
            });

            done();
        });
    });
});