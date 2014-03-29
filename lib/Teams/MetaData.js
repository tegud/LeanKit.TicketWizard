var _ = require('lodash');

function cleanUpMetaData(metaData) {
    delete metaData.formValidators;
    delete metaData.hasBoardMetaData;

    return metaData;
}

module.exports = function (folder) {
    var metaData = {
        forms: [],
        formValidators: {}
    };

    var fileExtensions = {
        'hbs': 'Template',
        'json': 'FormData'
    };

    function addForm(fileName) {
        metaData.formValidators[fileName] = {};
        metaData.forms.push(fileName);
    }

    return {
        hasBoardData: function() {
            metaData.hasBoardMetaData = true;
        },
        hasFile: function(file) {
            if(!metaData.formValidators[file.fileName()]) {
                addForm(file.fileName());
            }

            if(fileExtensions[file.extension()]) {
                var formValidatorProperty = 'has' + fileExtensions[file.extension()];
                metaData.formValidators[file.fileName()][formValidatorProperty] = true;
            }
        },
        setBoardData: function(data) {
            metaData.board = data;
        },
        get: function() {
            var cloneOfMetaData = _.extend({}, metaData);

            return cleanUpMetaData(cloneOfMetaData);
        },
        validate: function(callback) {
            var errors = [];

            if(!metaData.hasBoardMetaData) {
                errors.push('Team ' + folder + ' has no board.json file.');
            }

            _.each(metaData.forms, function(form) {
                if(!metaData.formValidators[form].hasTemplate) {
                    errors.push('Team ' + folder + ', ' + form + ' has a missing template');
                }

                if(!metaData.formValidators[form].hasFormData) {
                    errors.push('Team ' + folder + ', ' + form + ' has a missing json file');
                }
            });

            if(errors.length) {
                callback(errors);
            }
            else {
                callback(undefined);
            }
        }
    };
};
