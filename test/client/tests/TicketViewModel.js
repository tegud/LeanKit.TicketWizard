(function () {
    'use strict';

    describe('TicketViewModel', function() {
        beforeEach(function() {
            $('body').append('<form id="test-fixture">' +
                '<input type="text" class="request-item" id="field-one" data-append-to="title" />' +
                '<textarea class="request-item" id="field-two" data-append-to="title"></textarea>' +
                '</form>');
        });

        afterEach(function() {
            $('#test-fixture').remove();
        });

        it('sets title to value of fields set to appendTo title', function() {
            var viewModelFactory = new TW.TicketViewModel($('#test-fixture'));

            $('#field-one').val('testValue');
            $('#field-two').val('anotherTestValue');

            var viewModel = viewModelFactory.build();

            expect(viewModel).to.eql({
                title: 'testValue anotherTestValue'
            });
        });
    });
})();
