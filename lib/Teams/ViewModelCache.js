var _ = require('lodash');

module.exports = function() {
    var cache = {};

    function get(path, callback) {
        var viewModel = _.clone(cache[path]);

        callback(null, viewModel);
    }

    return {
        getOrAdd: function(path, callback, addFunction) {
            if(cache[path]) {
                get(path, callback);
                return;
            }

            addFunction(path, function(err, viewModel) {
                cache[path] = viewModel;
                get(path, callback);
            });
        }
    }
};