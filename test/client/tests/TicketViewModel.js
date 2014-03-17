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
                    '<input type="text" class="request-item" id="field-one" data-append-to="title" value="testValue" />' +
                    '<textarea class="request-item" id="field-two" data-append-to="title">anotherTestValue</textarea>' +
                    '<input type="text" class="request-item" id="field-three" data-append-to="description" data-fillpoint="two" value="secondTestValue" />' +
                    '<textarea class="request-item" id="field-four" data-append-to="description" data-fillpoint="three">thirdTestValue</textarea>' +
                    '</form>');
            });

            it('sets replaces new line characters with <br /> tags in description', function() {
                var viewModelFactory = new TW.TicketViewModel($('#test-fixture'));

                $('#field-four').val('one\r\ntwo');

                var viewModel = viewModelFactory.build();

                expect(viewModel.description.three).to.eql('one<br />two');
            });
        });
    });
})();
