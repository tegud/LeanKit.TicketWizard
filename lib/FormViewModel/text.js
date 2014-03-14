module.exports = function (config, callback) {
	var textField = {
        type: 'text',
        label: config.label,
        appendTo: config.appendTo || "description"
    };

    if(config.size === 'multi-line') {
        textField.inputType = 'textArea';
    }
    else {
        textField.inputType = 'textField';
    }

    if(config.placeholder) {
    	textField.placeholder = config.placeholder;
    }

    callback(null, textField);
};
