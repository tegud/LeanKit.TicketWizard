var async = require('async');
var hbs = require('hbs');
var fs = require('fs');

module.exports = function() {
    var components = {};

    hbs.registerHelper('renderComponent', function (name) {
        var componentTemplate = components[name];
        if(!componentTemplate) {
            return;
        }
        return new hbs.handlebars.SafeString(componentTemplate(this));
    });

    return {
        registerDir: function(partialsDir) {
            return function(callback) {
                async.waterfall([
                    function(callback) {
                        callback(null, partialsDir);
                    },
                    fs.readdir,
                    function(filenames, callback) {
                        async.each(filenames, function(filename, callback) {
                            var matches = /^([^.]+).hbs$/.exec(filename);
                            if (!matches) {
                                return;
                            }
                            var name = matches[1];
                            fs.readFile(partialsDir + '/' + filename, 'utf8', function(err, template) {
                                components[name] = hbs.handlebars.compile(template);
                                callback();
                            });
                        }, callback);
                    }
                ], callback);
            };
        }
    };
};
