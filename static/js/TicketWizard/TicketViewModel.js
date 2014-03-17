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

    TW.TicketViewModel = function(rootElement) {
        return {
            build: function() {
                var titles = [];
                var description = {};

                $('.request-item', rootElement).each(function() {
                    var item = $(this);
                    var appendTo = item.data('appendTo');
                    var fillpoint = item.data('fillpoint');

                    if(this.tagName.toLowerCase() === 'table') {
                        description[fillpoint] = componentBuilders['table'](item);
                    }
                    else {
                        if(appendTo === 'title') {
                            titles.push(item.val());
                        }
                        else {
                            description[fillpoint] = componentBuilders['field'](item);
                        }
                    }
                });

                return {
                    title: titles.join(' '),
                    description: description
                };
            }
        };
    };
})();
