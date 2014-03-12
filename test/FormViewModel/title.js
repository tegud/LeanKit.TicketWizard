var expect = require('expect.js');
var buildTitle = require('../../lib/FormViewModel/title');

describe('Title', function () {
    it('sets label to configured value', function (done) {
        buildTitle({
            label: 'This is the title'
        }, function(err, title) {
            expect(title.label).to.be('This is the title');
            done();
        })
    });
});