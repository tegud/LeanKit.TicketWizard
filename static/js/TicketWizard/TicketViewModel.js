(function () {
    'use strict';

    window['TW'] = window['TW'] || {};

    var componentBuilders = {
        'field': function buildFromField(field) {
            return field.val().replace(/\r?\n/g, "<br />");
        },
        'table': function buildFromTable(item) {
            var rows = [];
            var headerRows = $('.header-row:not(.template-row)', item);
            var rowElements = headerRows.map(function() {
                return $('.row-' + $(this).data('rowUid') + ':not(.header-row)');
            });

            rowElements.each(function() {
                var columns = [];

                this.each(function() {
                    var inputField = $('.table-input', this);

                    columns.push({ name: inputField.data('fillpoint'), value: componentBuilders['field'](inputField)} );
                });

                rows.push({
                    columns: columns
                });
            });

            return {
                rows: rows
            };
        }
    };

    function Model() {
        var model = {
            title: [],
            description: {}
        };

        return {
            title: function(value) {
                model.title.push(value);
            },
            description: function(value, fillpoint) {
                model.description[fillpoint] = value;
            },
            get: function() {
                var clone = $.extend(true, {}, model);
                clone.title = clone.title.join(' ');
                return clone;
            }
        };
    }

    function getComponentFromTagName(tagName) {
        if(tagName.toLowerCase() === 'table') {
            return 'table';
        }

        return 'field';
    }

    TW.TicketViewModel = function(rootElement) {
        return {
            build: function() {
                var model = new Model();

                $('.request-item', rootElement).each(function() {
                    var item = $(this);
                    var appendTo = item.data('appendTo') || 'description';
                    var fillpoint = item.data('fillpoint');
                    var component = getComponentFromTagName(this.tagName);
                    var value = componentBuilders[component](item);

                    model[appendTo](value, fillpoint);
                });

                return model.get();
            }
        };
    };
})();
