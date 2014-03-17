var expect = require('expect.js');
var fieldIdGenerator = require('../../../lib/FormViewModel/fieldId');

describe('fieldId', function () {
    it('returns formField-0 for first id generated', function (done) {
        fieldIdGenerator(function(err, id) {
            expect(id).to.be("formField-0");
            done(err);
        });
    });

    it('returns myPrefix-0 for the id generated with specified prefix', function(done) {
        fieldIdGenerator('myPrefix', function(err, id) {
            expect(id).to.be("myPrefix-0");
            done(err);
        });
    });

    it('returns uniquePrefix-1 for the second id generated with specified prefix', function(done) {
        fieldIdGenerator('uniquePrefix', function() { });

        fieldIdGenerator('uniquePrefix', function(err, id) {
            expect(id).to.be("uniquePrefix-1");
            done(err);
        });
    });
});