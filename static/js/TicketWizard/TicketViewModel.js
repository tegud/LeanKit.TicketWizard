(function () {
    'use strict';

    window['TW'] = window['TW'] || {};

    TW.TicketViewModel = function(rootElement) {
        return {
            build: function() {
                var titles = [];
                var description = {};

                $('.request-item', rootElement).each(function() {
                    var item = $(this);
                    var appendTo = item.data('appendTo');

                    if(appendTo === 'title') {
                        titles.push(item.val());
                    }
                    else {
                        description[item.data('fillpoint')] = item.val().replace(/\r?\n/g, "<br />");
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
