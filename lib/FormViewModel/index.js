var async = require('async');

var components = {
    text: require('./text')
};

function buildFields(fields, callback) {
    async.map(fields, function(fieldConfig, callback) {
        components[fieldConfig.type](fieldConfig, callback);
    }, callback);
}

function buildSections(sections, callback) {
    async.map(sections, function(sectionConfig, callback) {
        buildFields(sectionConfig.fields, function(err, results) {
            var sectionViewModel = {
                fields: results
            };

            if(sectionConfig.title) {
                sectionViewModel.title = sectionConfig.title;
            }
            console.log(callback);

            callback(err, sectionViewModel);
        }, callback);
    });
}

module.exports = function (options, callback) {
    buildSections(options.sections, function(err, results) {
        callback(err, {
            sections: results
        });
    });
};
