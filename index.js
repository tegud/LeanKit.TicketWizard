'use strict';

var express = require('express');
var http = require('http');
var hbs = require('hbs');
var handlebars = hbs.handlebars;
var LeanKitClient = require('leankit-client');
var fs = require('fs');
var _ = require('lodash');

var server = function() {
    var httpServer;

    var app = express();

    app.set('view engine', 'html');
    app.engine('html', hbs.__express);

    app.use(express.json());

    app.use("/static", express.static(__dirname + '/static'));

    app.use('/create', function(req, res) {
        var client = LeanKitClient.newClient('lrtest', 'steve.elliot@laterooms.com', '10Six12');
        var boardId = 91399429;
        var insertIntoLaneId = 91557453;
        var cardTypeId = 91551782;
        var boardIdentifiers;

        fs.readFile(__dirname + '/ticketTemplates/bauRequest.hbs', { encoding: 'utf-8' }, function(err, fileContents) {
            var template = handlebars.compile(fileContents);
            var description = template(req.body.description);

            var testCard = {
                Title: req.body.title,
                Description: description,
                TypeId: cardTypeId,
                Priority: 1,
                Size: 0,
                IsBlocked: false,
                BlockReason: '',
                DueDate: '',
                ExternalSystemName: '',
                ExternalSystemUrl: '',
                Tags: req.body.tags.join(','),
                ClassOfServiceId: null,
                ExternalCardId: '',
                AssignedUserIds: []
            };

            client.addCard(boardId, insertIntoLaneId, 0, testCard, function(err, newCard) { 
                res.end(err);
            });
        });
    });

    app.use('/', function(req, res) {
        function createViewModel(formInfo) {
            _.each(formInfo.sections, function(section) {
                _.each(section.fields, function(field) {
                    field.fieldCssClass = 'request-item';
                    field.name = field.name || field.fillpoint || field.label.replace(/ /g, '-').toLowerCase();

                    if(field.options) {
                        field.isMultiChoice = true;
                    }
                    else if(field.type === 'description') {
                        field.isTextArea = true;
                        field.fieldCssClass += ' request-details';
                    }
                    else {
                        field.isTextField = true;
                        field.fieldCssClass += ' single-line';
                    }

                    if(field.size === 'small') {
                        field.fieldCssClass += ' small';   
                    }
                });
            });

            return formInfo;
        }

        var data  = {
            title: 'LateRooms BAU Ticket Requests',
            summary: 'In order for the business to effectively prioritise the IT backlog all requests must be made through the completion of this form. The more detail you are able to provide (particularly in terms of defining the business benefit) the greater opportunity that your ticket will be prioritised and worked upon.',
            sections: [
                {
                    fields: [
                        {
                            label: 'Your Name',
                            type: 'tag'
                        },
                        {
                            label: 'Department',
                            type: 'tag'
                        },
                        {
                            label: 'Name of Ticket',
                            type: 'title'
                        }
                    ]
                },
                {
                    fields: [
                        {
                            label: 'Details of Ticket / Summary of Issue',
                            type: 'description',
                            fillpoint: 'summary'
                        },
                        {
                            label: 'Requirements',
                            type: 'description',
                            fillpoint: 'requirements'
                        }
                    ]
                },
                {
                    /*
                    <li>
                        <label>Identify if the change will affect more than one page</label>
                        <div class="request-item" data-field-type="multi-choice">
                            <label><input type="radio" name="MoreThanOnePage" value="Affects more than one page" /> Yes</label>
                            <label><input type="radio" name="MoreThanOnePage" value="" checked /> No</label>
                        </div>
                    </li>
                    <li>
                        <label>Identify the specific expected behaviour</label>
                    </li>
                    <li>
                        <label>Identify the specific constraints</label>
                    </li>
                    <li>
                        <label>Identify if a new text will be introduced</label>
                    </li>
                    <li>
                        <label>Translation of new text </label>
                    </li>
                    <li>
                        <label>Identify if the artwork is needed and provided</label>
                    </li>
                    */
                    fields: [
                        {
                            label: 'Which site / sites will the change be made to?',
                            name: 'Sites',
                            type: 'tag',
                            options: [
                                { value: 'LR.com' },
                                { value: 'LR.com Mobile' },
                                { value: 'AR.com' },
                                { value: 'AR.com Mobile' },
                            ]
                        },
                        { label: '',  }
                    ]
                }, 
                {
                    fields: [
                        {
                            label: 'Background / Reason for change',
                            type: 'description',
                            fillpoint: 'background',
                            size: 'small'
                        },
                        {
                            label: 'Business Rationale / Impact',
                            type: 'description',
                            fillpoint: 'businessRationale'
                        },
                        {
                            label: 'How will success be measured?',
                            type: 'description',
                            fillpoint: 'successMeasurement',
                            size: 'small'
                        }
                    ]
                }
            ]
        };

        res.render('index.hbs', createViewModel(data));
    });

    return {
        start: function(options, callback) {
            httpServer = http.createServer(app);
            httpServer.listen(options.port, function() {
                if(callback) {
                    callback(undefined, httpServer);
                }
            });
        },
        stop: function(callback) {
            httpServer.close(callback);
        }
    };
};

if(require.main === module) {
    new server().start({
        port: 3001
    });
}

module.exports = server;