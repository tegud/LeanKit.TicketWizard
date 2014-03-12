var async = require('async');

var components = {
    title: require('./title')
};

function buildFields(fields, callback) {
    async.map(fields, function(fieldConfig, callback) {
        components[fieldConfig.type](fieldConfig, callback);
    }, callback);
}

function buildSections(sections, callback) {
    async.map(sections, function(sectionConfig, callback) {
        buildFields(sectionConfig.fields, function(err, results) {
            callback(err, {
                fields: results
            });
        });
    }, callback);
}

module.exports = function (options, callback) {
    buildSections(options.sections, function(err, results) {
        callback(err, {
            sections: results
        });
    });
};
