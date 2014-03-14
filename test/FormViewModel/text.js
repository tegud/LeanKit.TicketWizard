var expect = require('expect.js');
var buildTitle = require('../../lib/FormViewModel/text');

describe('text', function () {
    it('sets label to configured value', function (done) {
        buildTitle({
            label: 'This is the title'
        }, function(err, title) {
            expect(title.label).to.be('This is the title');
            done();
        })
    });

    it('sets appendTo to configured value', function (done) {
        buildTitle({
            appendTo: 'title'
        }, function(err, title) {
            expect(title.appendTo).to.be('title');
            done();
        })
    });
});
