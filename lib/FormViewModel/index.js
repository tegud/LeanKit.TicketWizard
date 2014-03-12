var _ = require('lodash');

var titleField = require('./title');

module.exports = function (options, callback) {
    var viewModel = {
        sections: []
    };

    _.each(options.sections, function(sectionConfig) {
        var viewModelSection = {
            fields: []
        }

        _.each(sectionConfig.fields, function(fieldConfig) {
            viewModelSection.fields.push({
                type: fieldConfig.type,
                label: fieldConfig.type
            });
        });

        viewModel.sections.push(viewModelSection);
    });

    callback(null, viewModel);
};
