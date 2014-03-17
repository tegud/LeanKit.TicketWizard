(function () {
    'use strict';

    window['TW'] = window['TW'] || {};

    TW.TicketViewModel = function(rootElement) {
        return {
            build: function() {
                var titles = [];

                $('.request-item', rootElement).each(function() {
                    var item = $(this);
                    var appendTo = item.data('appendTo');

                    if(appendTo === 'title') {
                        titles.push(item.val());
                    }
                });

                return {
                    title: titles.join(' ')
                };
            }
        };
    };
})();
