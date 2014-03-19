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

    TW.TicketViewModel = function(rootElement) {
        var formFields = new TW.FormFields(rootElement);

        return {
            build: function() {
                var model = new Model();

                formFields.each(function() {
                    var appendTo = this.field.data('appendTo') || 'description';
                    var fillpoint = this.field.data('fillpoint');
                    var component = TW.getComponentViewModel(this.componentName);
                    var value = component(this.field);

                    model[appendTo](value, fillpoint);
                });

                return model.get();
            }
        };
    };
})();
