var expect = require('expect.js');
var proxyquire = require('proxyquire');

var expectedId;

var buildTitle = proxyquire ('../../../lib/FormViewModel/text', {
    './fieldId': function(prefix, callback) {
        if(!callback) {
            callback = prefix;
        }

        callback(null, expectedId);
    }
});

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

    it('sets fieldCssClass to "request-item request-details small" when size is multi-line', function(done) {
        buildTitle({
            size: 'multi-line'
        }, function(err, title) {
            expect(title.fieldCssClass).to.be('request-item request-details small');
            done();
        });
    });

    it('sets fieldCssClass to "request-item" when size is single-line', function(done) {
        buildTitle({
            size: 'single-line'
        }, function(err, title) {
            expect(title.fieldCssClass).to.be('request-item');
            done();
        });
    });

    it('sets fieldId to value generated from fieldId', function(done) {
        expectedId = 'formFieldId';

        buildTitle({
            size: 'single-line'
        }, function(err, title) {
            expect(title.fieldId).to.be('formFieldId');
            done();
        });
    });
});
