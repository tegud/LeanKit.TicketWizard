(function () {
    'use strict';

    window['TW'] = window['TW'] || {};

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

        return 'text';
    }

    TW.TicketViewModel = function(rootElement) {
        return {
            build: function() {
                var model = new Model();

                $('.request-item', rootElement).each(function() {
                    var field = $(this);
                    var appendTo = field.data('appendTo') || 'description';
                    var fillpoint = field.data('fillpoint');
                    var componentName = getComponentFromTagName(this.tagName);
                    var component = TW.getComponentViewModel(componentName);
                    var value = component(field);

                    model[appendTo](value, fillpoint);
                });

                return model.get();
            }
        };
    };
})();
