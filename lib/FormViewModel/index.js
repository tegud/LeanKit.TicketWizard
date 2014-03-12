var _ = require('lodash');

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
                type: fieldConfig.type
            });
        });

        viewModel.sections.push(viewModelSection);
    });

    callback(viewModel);
};
