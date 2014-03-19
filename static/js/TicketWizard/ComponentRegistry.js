(function () {
    'use strict';

    window['TW'] = window['TW'] || {};

    var components = {};
    var setups = {};

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
        var formFields = new TW.FormFields(rootElement);

        formFields.each(function() {
            if(setups[this.componentName]) {
                setups[this.componentName](this.field);
            }
        });
    };
})();
