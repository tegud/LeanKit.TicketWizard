(function () {
    'use strict';

    TW.registerComponentViewModel('text', function (field) {
        var value = field.val();

        value = value.replace(/\r?\n/g, "<br />");

        return value;
    });
})();
