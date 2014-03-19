var expect = require('expect.js');
var buildTable = require('../../../lib/FormViewModel/table');

describe('table', function () {
    it('sets lastRow to true for last row', function(done) {
        buildTable({
            rows: [
                {}
            ]
        }, function(err, table) {
            expect(table.rows[0].lastRow).to.be(true);
            done();
        });
    });

    it('sets lastRow to false for first row', function(done) {
        buildTable({
            rows: [{ }, { }]
        }, function(err, table) {
            expect(table.rows[0].lastRow).to.be(false);
            done();
        });
    });

    it('sets row label', function(done) {
        buildTable({
            rows: [
                { label: 'a' }
            ]
        }, function(err, table) {
            expect(table.rows[0].label).to.be('a');
            done();
        });
    });

    it('sets row fillpoint to label', function(done) {
        buildTable({
            label: 'a'
        }, function(err, table) {
            expect(table.fillpoint).to.be('a');
            done();
        });
    });

    it('sets row fillpoint to configured fillpoint when specified', function(done) {
        buildTable({
            label: 'a',
            fillpoint: 'b'
        }, function(err, table) {
            expect(table.fillpoint).to.be('b');
            done();
        });
    });

    it('sets row inputType', function(done) {
        buildTable({
            rows: [
                { type: 'text' }
            ]
        }, function(err, table) {
            expect(table.rows[0].inputType).to.be('inputTextField');
            done();
        });
    });

    it('sets row inputType to textArea when size is multi-line', function(done) {
        buildTable({
            rows: [
                {
                    type: 'text',
                    size: 'multi-line'
                }
            ]
        }, function(err, table) {
            expect(table.rows[0].inputType).to.be('inputTextArea');
            done();
        });
    });

    it('sets fieldCellCssClass to table-textarea when size is multi-line', function(done) {
        buildTable({
            rows: [
                {
                    type: 'text',
                    size: 'multi-line'
                }
            ]
        }, function(err, table) {
            expect(table.rows[0].fieldCellCssClass).to.be('textarea-cell');
            done();
        });
    });

    it('sets inputCssClass to table-input', function(done) {
        buildTable({
            rows: [
                {
                    type: 'text'
                }
            ]
        }, function(err, table) {
            expect(table.rows[0].fieldCssClass).to.be('table-input');
            done();
        });
    });

    it('sets inputCssClass to table-input table-textarea when size is multi-line', function(done) {
        buildTable({
            rows: [
                {
                    type: 'text',
                    size: 'multi-line'
                }
            ]
        }, function(err, table) {
            expect(table.rows[0].fieldCssClass).to.be('table-input table-textarea');
            done();
        });
    });
});
