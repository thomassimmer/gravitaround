(function($){
    'use strict';

    function DetailViewInit(object_list, detail_view, options) {
        options = options || {};

        var detail_container = detail_view.parent(),
            no_affix = options.no_affix || false;

        if (!no_affix) {
            $(document).ready(function() {
                detail_view.affix({ offset: { top: detail_container.offset().top } });
            });
        }

        $(object_list).on("click", "*[data-detailload]", function(e) {
            var el = $(this);
            $.ajax({
                url: el.data('detailload'),
                success: function(data) {
                    detail_view.html(data);
                    $('.highlight', object_list).removeClass('highlight');
                    el.addClass('highlight');
                    window.history.pushState(window.history.state, null, el.data('detailload') + location.search);
                },
            });
        });
    }

    $.fn.detailViewInit = function(detail_view, options) {
        return this.each(function() {
            if (!$.data(this, 'plugin_detailView')) {
                $.data(this, 'plugin_detailView', new DetailViewInit(this, detail_view, options));
            }
        });
    };
})(jQuery);
