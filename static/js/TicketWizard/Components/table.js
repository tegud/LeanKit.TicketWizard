(function () {
    'use strict';

    var componentName = 'table';

    TW.registerComponentViewModel(componentName, function (field) {
        var rows = [];
        var headerRows = $('.header-row:not(.template-row)', field);
        var rowElements = headerRows.map(function() {
            return $('.row-' + $(this).data('rowUid') + ':not(.header-row)');
        });

        rowElements.each(function() {
            var columns = [];

            this.each(function() {
                var inputField = $('.table-input', this);

                columns.push({ name: inputField.data('fillpoint'), value: TW.getComponentViewModel('text')(inputField)} );
            });

            rows.push({
                columns: columns
            });
        });

        return {
            rows: rows
        };
    });

    function setHeaderIndicies(element) {
        $('.header-row:not(.template-row) .row-index', element).each(function(i) {
            $(this).text(i + 1);
        });
    }

    TW.registerComponentSetup(componentName, function(element) {
        var templateRows = $('.template-row', element);
        var rowUid = 0;

        element
            .on('click', '.add-row-button', function() {
                var currentRowUid = rowUid++;

                templateRows
                    .clone()
                    .removeClass('template-row')
                    .addClass('row-' + currentRowUid)
                    .data('rowUid', currentRowUid)
                    .insertBefore(templateRows[0]);

                setHeaderIndicies(element);
            });
    });
})();
