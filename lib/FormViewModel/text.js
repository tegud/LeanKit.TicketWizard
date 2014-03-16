var generateFieldId = require('./fieldId');

module.exports = function (config, callback) {
	var textField = {
        label: config.label,
        appendTo: config.appendTo || 'description',
        fieldCssClass: 'request-item',
        inputType: 'textField'
    };

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
