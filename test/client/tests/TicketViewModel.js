(function () {
    'use strict';

    describe('TicketViewModel', function() {
        afterEach(function() {
            $('#test-fixture').remove();
        });

        describe('TextField', function() {
            beforeEach(function() {
                $('body').append('<form id="test-fixture">' +
                    '<input type="text" class="request-item" id="field-one" data-append-to="title" value="testValue" />' +
                    '<textarea class="request-item" id="field-two" data-append-to="title">anotherTestValue</textarea>' +
                    '<input type="text" class="request-item" id="field-three" data-append-to="description" data-fillpoint="two" value="secondTestValue" />' +
                    '<textarea class="request-item" id="field-four" data-append-to="description" data-fillpoint="three">thirdTestValue</textarea>' +
                    '</form>');
            });

            it('sets description to value of text fields set to appendTo title', function() {
                var viewModelFactory = new TW.TicketViewModel($('#test-fixture'));
                var viewModel = viewModelFactory.build();

                expect(viewModel.title).to.eql('testValue anotherTestValue');
            });

            it('sets description to map of fillpoint to value', function() {
                var viewModelFactory = new TW.TicketViewModel($('#test-fixture'));
                var viewModel = viewModelFactory.build();

                expect(viewModel.description).to.eql({
                    two: 'secondTestValue',
                    three: 'thirdTestValue'
                });
            });

            it('sets replaces new line characters with <br /> tags in description', function() {
                var viewModelFactory = new TW.TicketViewModel($('#test-fixture'));

                $('#field-four').val('one\r\ntwo');

                var viewModel = viewModelFactory.build();

                expect(viewModel.description.three).to.eql('one<br />two');
            });
        });

        describe('Table', function() {
            beforeEach(function() {
                $('body').append('<form id="test-fixture">' +
                    '<table class="request-item" data-fillpoint="Requirements">' +
                        '<tr class="header-row" data-row-uid="0">' +
                            '<th colspan="2">' +
                                '<div>Requirement #<span class="row-index">1</span></div>' +
                                '<a class="btn btn-danger delete-row-button" role="button"><span class="glyphicon glyphicon-trash requirement-delete"></span></a>' +
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
                        '</tr>' +
                        '<tr class="template-row header-row">' +
                            '<th colspan="2" class="table-header">' +
                                '<div class="table-header-text">Requirement #<span class="row-index">2</span></div>' +
                                '<a class="btn btn-danger delete-row-button" role="button"><span class="glyphicon glyphicon-trash requirement-delete"></span></a>' +
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
                        '<tr>' +
                            '<td colspan="2" class="new-row"><a class="btn btn-success add-row-button" role="button"><span class="glyphicon glyphicon-plus"></span> Add Requirement</a></td>' +
                        '</tr>' +
                    '</table>' +
                    '</form>');
            });

            it('sets table description model', function() {
                var viewModelFactory = new TW.TicketViewModel($('#test-fixture'));
                var viewModel = viewModelFactory.build();

                expect(viewModel.description).to.eql({
                    Requirements: {
                        rows: [
                            {
                                columns: [
                                    { name: 'As a', value: 'User of a website' },
                                    { name: 'I would like', value: 'to click a<br />button' },
                                    { name: 'So that', value: 'Money is made' }
                                ]
                            }
                        ]
                    }
                });
            });
        });
    });
})();
