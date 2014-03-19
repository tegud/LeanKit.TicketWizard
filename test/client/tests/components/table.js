(function () {
    'use strict';

    describe('Table', function() {
        beforeEach(function() {
            $('body').append('<table class="request-item" data-fillpoint="Requirements" id="test-fixture">' +
                '<tr class="template-row header-row">' +
                '<th colspan="2" class="table-header">' +
                '<div class="table-header-text">Requirement #<span class="row-index"></span></div>' +
                '<a class="btn btn-danger delete-row-button" role="button"><span class="glyphicon glyphicon-trash row-delete"></span></a>' +
                '</th>' +
                '</tr>' +
                '<tr class="template-row field-row ">' +
                '<th>As a</th>' +
                '<td><input type="text" class="table-input" data-fillpoint="As a" /></td>' +
                '</tr>' +
                '<tr class="template-row field-row ">' +
                '<th>I Would like</th>' +
                '<td class="textarea-cell"><textarea class="table-input table-textarea"></textarea></td>' +
                '</tr>' +
                '<tr class="template-row field-row  last-row">' +
                '<th>So that</th>' +
                '<td class="textarea-cell"><textarea class="table-input table-textarea" data-fillpoint="So that"></textarea></td>' +
                '</tr>' +
                '<tr class="new-item-row">' +
                '<td colspan="2" class="new-row"><a class="btn btn-success add-row-button" role="button"><span class="glyphicon glyphicon-plus"></span> Add Requirement</a></td>' +
                '</tr>' +
                '</table>');
        });

        afterEach(function() {
            $('#test-fixture').remove();
        });

        describe('ViewModel Builder', function() {
            it('sets table description model', function() {
                var tableElement = $('#test-fixture').prepend('<tr class="header-row" data-row-uid="0">' +
                    '<th colspan="2">' +
                    '<div>Requirement #<span class="row-index">1</span></div>' +
                    '<a class="btn btn-danger delete-row-button" role="button"><span class="glyphicon glyphicon-trash row-delete"></span></a>' +
                    '</th>' +
                    '</tr>' +
                    '<tr class="field-row row-0">' +
                    '<th>As a</th>' +
                    '<td><input type="text" class="table-input" data-fillpoint="As a" value="User of a website"/></td></tr>' +
                    '<tr class="field-row row-0">' +
                    '<th>I Would like</th>' +
                    '<td class="textarea-cell"><textarea class="table-input table-textarea" data-fillpoint="I would like">to click a\r\nbutton</textarea></td>' +
                    '</tr>' +
                    '<tr class="field-row row-0 last-row">' +
                    '<th>So that</th>' +
                    '<td class="textarea-cell"><textarea class="table-input table-textarea" data-fillpoint="So that">Money is made</textarea></td>' +
                    '</tr>');

                var tableViewModelBuilder = TW.getComponentViewModel('table');
                var viewModel = tableViewModelBuilder(tableElement);

                expect(viewModel).to.eql({
                    rows: [
                        {
                            columns: [
                                { name: 'As a', value: 'User of a website' },
                                { name: 'I would like', value: 'to click a<br />button' },
                                { name: 'So that', value: 'Money is made' }
                            ]
                        }
                    ]
                });
            });
        });

        describe('Component Setup', function() {
            it('adds a new set of rows when add requirement is clicked', function() {
                var table = $('#test-fixture');
                var addRowButton = $('.add-row-button', table);

                TW.runComponentSetup();

                addRowButton.trigger('click');

                expect($('tr:not(.template-row):not(.new-item-row)', table).length).to.be(4);
            });

            it('sets a row-uid of 0 to the first new row', function() {
                var table = $('#test-fixture');
                var addRowButton = $('.add-row-button', table);

                TW.runComponentSetup();

                addRowButton.trigger('click');

                expect($('tr.header-row:not(.template-row)', table).data('rowUid')).to.be(0);
            });

            it('sets a row-uid of 1 to the second new row', function() {
                var table = $('#test-fixture');
                var addRowButton = $('.add-row-button', table);

                TW.runComponentSetup();

                addRowButton.trigger('click');
                addRowButton.trigger('click');

                expect($('tr.header-row:eq(1):not(.template-row)', table).data('rowUid')).to.be(1);
            });

            it('sets the row-0 class on the new set of added rows', function() {
                var table = $('#test-fixture');
                var addRowButton = $('.add-row-button', table);

                TW.runComponentSetup();

                addRowButton.trigger('click');

                expect($('tr.row-0', table).length).to.be(4);
            });

            it('sets the header text to Requirement #1', function() {
                var table = $('#test-fixture');
                var addRowButton = $('.add-row-button', table);

                TW.runComponentSetup();

                addRowButton.trigger('click');

                expect($('tr.row-0.header-row .row-index', table).text()).to.be('1');
            });

            it('remove button removes row', function() {
                var table = $('#test-fixture');
                var addRowButton = $('.add-row-button', table);
                var removeRowButton;

                TW.runComponentSetup();

                addRowButton.trigger('click');

                removeRowButton = $('tr:not(.template-row) .delete-row-button', table);
                removeRowButton.trigger('click');

                expect($('tr:not(.template-row):not(.new-item-row)', table).length).to.be(0);
            });

            it('remove button reindexes header text', function() {
                var table = $('#test-fixture');
                var addRowButton = $('.add-row-button', table);
                var removeRowButton;

                TW.runComponentSetup();

                addRowButton.trigger('click');
                addRowButton.trigger('click');

                removeRowButton = $('tr:not(.template-row) .delete-row-button:first', table);
                removeRowButton.trigger('click');

                expect($('tr.row-1.header-row .row-index', table).text()).to.be('1');
            });
        });
    });
})();
