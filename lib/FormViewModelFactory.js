'use strict';

var _ = require('lodash');
var cheerio = require('cheerio');

function parseDescription(cardDescription) {
    var $ = cheerio.load(cardDescription);
    var parsedData = {};
    var dataValues = $('.data-value');
    var dataTables = $('.data-table');

    dataValues.each(function() {
        var label = $(this).data('fieldValue');
        var text = $(this).html();

        parsedData[label] = text.replace(/<br( )?(\/)?>/g, '\r\n');
    });

    dataTables.each(function() {
        var table = $(this);
        var fieldName = $(this).data('field');
        var rows = $('.data-table-row', table);
        var dataRows = [];

        rows.each(function(i) {
            var cells = $('.data-table-column-cell', this);
            var dataColumns = [];

            cells.each(function() {
                var cell = $(this);
                var cellLabel = cell.data('fieldLabel');
                var cellText = cell.html();
                dataColumns.push({label: cellLabel, value: cellText });
            });

            dataRows.push({ index: (i + 1), columns: dataColumns });
        });

        parsedData[fieldName] = {
            rows: dataRows
        };
    });

    return parsedData;
}

module.exports = function (team, form, formInfo, card) {
    var parsedDescription = {};

    if(card) {
        parsedDescription = parseDescription(card.Description);
    }

    _.each(formInfo.sections, function(section) {
        _.each(section.fields, function(field) {
            field.fieldCssClass = 'request-item';
            field.name = field.name || field.fillpoint || field.label.replace(/ /g, '-').toLowerCase();

            if(field.options) {
                field.isMultiChoice = true;
                if(field.allowMultiple) {
                    field.inputType = 'checkbox';
                }
                else {
                    field.inputType = 'radio';
                }

                _.each(field.options, function(option) {
                    if(!option.label) {
                        option.label = option.value;
                    }
                });
            }
            else if(field.type === 'description' && field.size !== 'single-line') {
                field.isTextArea = true;
                field.fieldCssClass += ' request-details';
            }
            else if(field.type === 'table') {
                field.isTable = true;
            }
            else {
                field.isTextField = true;
                field.fieldCssClass += ' single-line';
            }

            if(field.size === 'small') {
                field.fieldCssClass += ' small';   
            }

            if(card) {
                if(field.type === 'table') {
                    var currentTable = parsedDescription[field.name];

                    if(currentTable) {
                        _.each(currentTable.rows, function(row, rowIndex) {
                            _.each(row.columns, function(column, columnIndex) {
                                var templateColumn = _.findWhere(field.rows, { label: currentTable.rows[0].columns[0].label });

                                currentTable.rows[rowIndex].columns[columnIndex] = _.extend({}, templateColumn, column);

                                console.log(currentTable.rows[rowIndex].columns[columnIndex]);
                            });
                        });
                    }

                    field.value = currentTable;
                }
                else {
                    field.value = card[field.ticketProperty] || parsedDescription[field.name];
                }
            }
        });
    });

    formInfo.createUrl = '/'  + team + '/' + form + '/create';

    return formInfo;
};