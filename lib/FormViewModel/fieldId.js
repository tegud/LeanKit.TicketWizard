var prefixes = {};

module.exports = function (prefix, callback) {
    if(!callback) {
        callback = arguments[0];
        prefix = 'formField';
    }

    if(prefixes[prefix] === undefined) {
        prefixes[prefix] = 0;
    }
    else {
        prefixes[prefix]++;
    }

    callback(null, prefix + '-' + prefixes[prefix]);
};
