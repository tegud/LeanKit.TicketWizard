'use strict';

var _ = require('lodash');

module.exports = function (team, form, formInfo) {
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
            else if(field.type === 'description') {
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
        });
    });

    formInfo.createUrl = '/'  + team + '/' + form + '/create';

    return formInfo;
};