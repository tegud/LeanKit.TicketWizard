var expect = require('expect.js');
var buildTitle = require('../../lib/FormViewModel/text');

describe('text', function () {
    it('sets label to configured value', function (done) {
        buildTitle({
            label: 'This is the title'
        }, function(err, title) {
            expect(title.label).to.be('This is the title');
            done();
        });
    });

    it('sets appendTo to configured value', function (done) {
        buildTitle({
            appendTo: 'title'
        }, function(err, title) {
            expect(title.appendTo).to.be('title');
            done();
        });
    });

    it('sets placeholder to configured value', function(done) {
        buildTitle({
            placeholder: 'initial placeholder text'
        }, function(err, title) {
            expect(title.placeholder).to.be('initial placeholder text');
            done();
        });
    });

    it('sets inputType to textArea when size is multi-line', function(done) {
        buildTitle({
            size: 'multi-line'
        }, function(err, title) {
            expect(title.inputType).to.be('textArea');
            done();
        });
    });
});
