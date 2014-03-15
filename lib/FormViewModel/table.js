module.exports = function (config, callback) {
	var tableField = {
        type: 'table',
        inputType: 'table',
        appendTo: "description"
    };

    callback(null, tableField);
};
