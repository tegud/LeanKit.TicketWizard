(function () {
    'use strict';

    window['TW'] = window['TW'] || {};

    function getComponentFromTagName(tagName) {
        if(tagName.toLowerCase() === 'table') {
            return 'table';
        }

        return 'text';
    }

    TW.FormFields = function (rootElement) {
        return $('.request-item', rootElement).map(function() {
            return {
                field: $(this),
                componentName: getComponentFromTagName(this.tagName)
            };
        });
    };
})();
