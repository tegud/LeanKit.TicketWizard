module.exports = function (config, callback) {
	var textField = {
        type: config.type,
        label: config.label,
        inputType: "textField",
        appendTo: config.appendTo || "description"
    };

    if(config.placeholder) {
    	textField.placeholder = config.placeholder;
    }

    callback(null, textField);
};
