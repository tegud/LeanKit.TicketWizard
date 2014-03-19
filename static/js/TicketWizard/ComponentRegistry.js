(function () {
    'use strict';

    window['TW'] = window['TW'] || {};

    var components = {};
    var setups = {};

    function getComponentFromTagName(tagName) {
        if(tagName.toLowerCase() === 'table') {
            return 'table';
        }

        return 'text';
    }

    TW.registerComponentViewModel = function(name, component) {
        components[name] = component;
    };

    TW.registerComponentSetup = function(name, setup) {
        setups[name] = setup;
    };

    TW.getComponentViewModel = function(name) {
        return components[name];
    };

    TW.runComponentSetup = function(rootElement) {
        $('.request-item', rootElement).each(function() {
            var field = $(this);
            var componentName = getComponentFromTagName(this.tagName);

            if(setups[componentName]) {
                setups[componentName](field);
            }
        });
    };
})();
