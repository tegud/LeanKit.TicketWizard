module.exports = function (config, callback) {
	var textField = {
        label: config.label,
        appendTo: config.appendTo || "description"
    };

    if(config.size === 'multi-line') {
        textField.inputType = 'textArea';
        textField.fieldCssClass = 'request-item request-details small';
    }
    else {
        textField.inputType = 'textField';
    }

    if(config.placeholder) {
    	textField.placeholder = config.placeholder;
    }

    callback(null, textField);
};
