module.exports = function (config, callback) {
    callback(null, {
        type: config.type,
        label: config.label,
        inputType: "textField"
    });
};
