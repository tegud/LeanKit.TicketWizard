var async = require('async');
var _ = require('lodash');

module.exports = function (config, callback) {
	var tableField = {
        inputType: 'table',
        appendTo: "description",
        label: config.label
    };

    async.map(config.rows || [], function(rowConfig, callback) {
        var row = {
            lastRow: false,
            label: rowConfig.label,
            inputType: 'inputTextField',
            fieldCssClass: 'table-input'
        };

        if(rowConfig.size === 'multi-line') {
            row.fieldCellCssClass = 'textarea-cell';
            row.fieldCssClass += ' table-textarea';
            row.inputType = 'inputTextArea';
        }

        callback(null, row);
    }, function(err, results) {
        tableField.rows = results;

        if(tableField.rows && tableField.rows.length) {
            tableField.rows[tableField.rows.length - 1].lastRow = true;
        }

        callback(err, tableField);
    });
};
