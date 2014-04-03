var async = require('async');
var teams = require('../Teams');
var _ = require('lodash');

function lowerCaseFirstChar(value) {
    return value[0].toUpperCase() + value.substring(1);
}

var baseTicket = {
    Size: 0,
    Priority: 1,
    IsBlocked: false,
    BlockReason: '',
    DueDate: '',
    ExternalSystemName: '',
    ExternalSystemUrl: '',
    ClassOfServiceId: null,
    ExternalCardId: '',
    AssignedUserIds: []
};

var defaultMapper = function (value, callback) {
    callback(null, value);
};

module.exports = function(options) {
    var ticketMapper = [
        'typeId',
        'title',
        'size',
        {
            in: 'description',
            mapping: function(value, callback) {
                async.waterfall(
                    [
                        teams.getTicketTemplateForUrl.bind(undefined, options.url),
                        function(template, callback) {
                            var description = template(value);

                            callback(null, description);
                        }
                    ],
                    callback
                );
            }
        },
        {
            in: 'tags',
            mapping: function(value, callback) {
                callback(null, value.join(','));
            }
        }
    ];

    return {
        create: function(ticketInput, callback) {
            async.reduce(ticketMapper, _.clone(baseTicket),
                function(memo, propertyMapping, callback) {
                    var mapFrom = propertyMapping.in || propertyMapping;
                    var mapTo = propertyMapping.out || lowerCaseFirstChar(mapFrom);
                    var value = ticketInput[mapFrom] || options.boardMetaData[mapFrom];
                    var mappingFunction = propertyMapping.mapping;

                    if(!value) {
                        callback(null, memo);
                        return;
                    }

                    if(!mappingFunction) {
                        mappingFunction = defaultMapper;
                    }

                    mappingFunction(value, function(err, value) {
                        memo[mapTo] = value;
                        callback(err, memo);
                    });
                },
                callback);
        }
    };
};
