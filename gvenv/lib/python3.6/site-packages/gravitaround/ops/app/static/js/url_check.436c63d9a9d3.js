(function($) {
    "use strict";

    $.fn.CheckFlow = function() {
        var self = $(this);
        var checker_url = $('#url-checker').data('check-url');
        self.each(function(itemCount) {
            var trElem = $(this);
            var replaceElem = trElem.find('.check-result');
            var postData = {
                ws_name: trElem.data('ws-name')
            };
            replaceElem.text('Checking url ..'); // Base table cell content

            $.post(checker_url, postData, function(data) {
                trElem.addClass(data.status);
                replaceElem.text(data.content);
            })
            .fail(function() {
                trElem.addClass('danger');
                replaceElem.text('Failed to check url');
            })
        });
    };

})(jQuery);
