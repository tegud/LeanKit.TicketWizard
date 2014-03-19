var generateFieldId = require('./fieldId');

function toCamelCase(input){
    if(!input) {
        return input;
    }

    return input.toLowerCase().replace(/ (.)/g, function(match, characterAfterSpace) {
        return characterAfterSpace.toUpperCase();
    });
}

module.exports = function (config, callback) {
    var appendTo = config.appendTo || 'description';
	var textField = {
        label: config.label,
        appendTo: appendTo,
        fieldCssClass: 'request-item',
        inputType: 'textField',
        fillpoint: config.fillpoint || config.label
    };

    if(appendTo === 'description') {
        textField.fillpoint = toCamelCase(config.label);
    }

    if(config.size === 'multi-line') {
        textField.inputType = 'textArea';
        textField.fieldCssClass += ' request-details small';
    }

    if(config.placeholder) {
    	textField.placeholder = config.placeholder;
    }

    generateFieldId(function(err, id) {
        textField.fieldId = id;

        callback(err, textField);
    });
};
