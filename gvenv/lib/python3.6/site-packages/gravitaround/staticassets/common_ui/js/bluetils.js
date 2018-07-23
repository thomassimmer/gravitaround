/* Don't wait for the document to be ready or you will have a glitch */
jQuery("#sidebar > li > ul.collapse > li.active").parent('ul').collapse('show');

jQuery(function($) {
    "use strict";

    // Initialize Bootstrap plugins
    $('[data-toggle="tooltip"]').tooltip();
    $("[data-toggle=popover]").each(function() {
        $(this).popover({
          html: true,
          content: function() {
            return $('#popover-content-' + $(this).attr('id')).html();
          }
        });
    });

    // Use location hash to open the current tab
    if (window.location.hash) {
        $('[data-toggle="tab"][href="' + window.location.hash + '"]').tab('show');
    } else {
        $('[data-toggle="tab"]:first').tab('show');
    }

    // Initialize Bootbox plugins through helpers
    $('[data-toggle="bootbox-confirm"]').each(function() {
        $(this).click(function(event) {
            event.preventDefault();

            var button = $(this),
                message = button.data('message') || $(button.data('message-target')).html();

            bootbox.confirm({
                message: message,
                buttons: {
                    cancel: {
                        label: button.data('cancel-label'),
                    },
                    confirm: {
                        label: button.data('confirm-label')
                    }
                },
                callback: function(result) {
                    if (result) {
                        button.closest('form').append($('<input/>').attr({
                            type: 'hidden',
                            name: button.attr('name'),
                            value: 1
                        })).submit();
                    }
                }
            });
        });
    });

    function getMomentDateFormat() {
        var input = $(".bootstrap-datepicker input");
        if (input && input.attr('date-format')) {
            return input.attr('date-format');
        }
        return 'YYYY-MM-DD'; // Default ISO date
    }

    // All date pickers must have a datepicker
    // The code of bootsrap-datepicker will be deleted when the new datepicker is validated.
    $(".bootstrap-datepicker").datepicker({
      language: LANGUAGE_CODE,
      autoclose: true,
      todayBtn: true,
      todayHighlight: true,
      keyboardNavigation: false,
      returnEnabled: false,
      format: getMomentDateFormat().toLowerCase() // Get the date format from the one set by Django
    });

    // All datetime pickers must have a datetimepicker.
    // Alas, unlike datepicker and other similar plugins, datetimepicker has some serious performance issues.
    // So, we need to ensure that at most only one datetime picker is instantiated at any time.
    function bootstrapDateTimePicker(event) {
      $(event.currentTarget).closest('.bootstrap-datetimepicker').datetimepicker({
        language: LANGUAGE_CODE,
        pickerPosition: 'bottom-left',
        autoclose: true,
        todayHighlight: true,
        todayBtn: true,
        showMeridian: false,
        keyboardNavigation: false,
        returnEnabled: false,
        defaultTime: '',
        minuteStep: 30
      }).on('hide', function(event) {
        $(event.currentTarget).datetimepicker('remove');
      }).datetimepicker('show');
    }
    $('.bootstrap-datetimepicker input').focus(bootstrapDateTimePicker);
    $('.bootstrap-datetimepicker .input-group-addon').click(bootstrapDateTimePicker);

    // Initialize all select pickers.
    $('.bootstrap-selectpicker').selectpicker({
      container: 'body'
    });

    // Toggle chevron for accordion plugin
    $('.accordion').on('show hide', function() {
       $(this).find('.accordion-toggle i').toggleClass('icon-chevron-down icon-chevron-right');
    });

    // Clean search form inputs with a simple button
    $(document).on('click', '.btn-clear-form', function(event) {
        event.preventDefault();
        var fields = $(this).parents("form").find('input, select, textarea').not(':submit, :reset, :hidden, :button');
        fields.not(':checkbox, :radio').val('');
        fields.filter(':checkbox, :radio').prop('checked', false);
        // Clean hidden datetime input
        $(this).parents("form").find('input.datetimerange').val('');
    });

    function rotateAndTransform(target, angle, scale) {
        target.css({
           transform: "rotate(" + angle + "deg) scale(" + scale + ")"
        });
    }

    // All image modals must be autoscalable and draggable.
    $(document).on('show.bs.modal', '.modal.img-modal', function() {
        var $modal = $(this),
            $dialog = $modal.find('.modal-dialog'),
            $content = $dialog.find('.modal-content'),
            $body = $content.find('.modal-body'),
            $img = $body.find('img'),
            image = $img.get(0),
            $footer = $content.find('.modal-footer'),

            $btn_rotate_left= $footer.find('.btn-img-rotate-left'),
            $btn_rotate_right= $footer.find('.btn-img-rotate-right'),
            $btn_zoom_in= $footer.find('.btn-img-zoom-in'),
            $btn_zoom_out= $footer.find('.btn-img-zoom-out'),
            $btn_reset = $footer.find('.btn-img-reset'),

            img_angle = 0,
            ROTATE_DELTA = 90,

            img_scale = 1,
            ZOOM_DELTA = 0.1;

        // the modal is draggable only by the header/footer
        $modal.draggable({
             handle: ".modal-header, .modal-footer"
        });
        $img.draggable();

        $modal.css({
            'max-width': image.naturalWidth +
                parseInt($dialog.css('padding-left'), 10) +
                parseInt($dialog.css('padding-right'), 10) +
                parseInt($content.css('padding-left'), 10) +
                parseInt($content.css('padding-right'), 10) +
                2 * parseInt($content.css('border-width'), 10),
            'max-height': image.naturalHeight +
                parseInt($dialog.css('padding-top'), 10) +
                parseInt($dialog.css('padding-bottom'), 10) +
                parseInt($content.css('padding-top'), 10) +
                parseInt($content.css('padding-bottom'), 10) +
                2 * parseInt($content.css('border-width'), 10)
        });

        if ($content.find('a.close').length === Number(0)) {
            $content.prepend($('<a/>', {
                'class': 'close',
                'data-dismiss': 'modal',
                'aria-hidden': 'true'
            }));
        }
        $btn_rotate_left.click(function(){
            img_angle -= ROTATE_DELTA
            if (img_angle < 0) {
              img_angle += 360;
            }
            rotateAndTransform($img, img_angle, img_scale);
        });
        $btn_rotate_right.click(function(){
            img_angle = (img_angle + ROTATE_DELTA) % 360;
            rotateAndTransform($img, img_angle, img_scale);
        });
        $btn_zoom_in.click(function(){
            // max img scale factor 2
            if (img_scale + ZOOM_DELTA >= 2) {
                return;
            }
            img_scale += ZOOM_DELTA;
            rotateAndTransform($img, img_angle, img_scale);
        });
        $btn_zoom_out.click(function(){
            // min img scale factor 0.5
            if (img_scale - ZOOM_DELTA <= 0.5) {
                return;
            }
            img_scale -= ZOOM_DELTA;
            rotateAndTransform($img, img_angle, img_scale);
        });
        $btn_reset.click(function(){
            img_angle = 0;
            img_scale = 1;
            // reset to the orignal position
            $img.css({
                top: "0",
                right: "0"
            });
            rotateAndTransform($img, img_angle, img_scale);
        });
    });

    // Only enable Modal when the above js loads
    $('.thumbnail_modal a').each(function(){
       $(this).attr('data-toggle', 'modal');
    });

});
