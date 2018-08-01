'use strict';// jshint -W097
jQuery(function($) {

    var DateRangePickerUI = function(element, isDatetimepicker) {

        this.isDatetimepicker = isDatetimepicker;

        this.element = element;

        this.elementId = $(element).attr('id');

        this.hiddenElement = $(element).parents('.date').find('.datetimerange');

        this.format = this.isDatetimepicker ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD';

        this.format_datetimeTZoffset = 'YYYY-MM-DD HH:mmZZ';

        this.timezone_utc = 'Etc/UTC';

        this.timezone_browser = '';

        this.timezone_selected = '';

        this.timezone_locale = '';

        /* jshint undef: true, unused: true */
        /* globals TIME_ZONE */
        this.timezone_si = TIME_ZONE;

        this.time_utc = '';

        this.time_locale = '';

        this.time_si = '';

        this.timezone_utcOffset = 0;

        this.template = '<div class="daterangepicker dropdown-menu">' +
            '<div class="calendar left">' +
                '<div class="ranges paddingL20 paddingR20">' +
                    '<div class="range_inputs">' +
                        '<button class="applyBtn" disabled="disabled" type="button"></button> ' +
                    '</div>' +
                '</div>' +
                '<div class="calendar-table"></div>' +
                '<div class="daterangepicker_input">' +
                  '<input class="input-mini" type="text" name="daterangepicker_start" value="" />' +
                  '<i class="fa fa-calendar glyphicon glyphicon-calendar"></i>' +
                  '<div class="calendar-time">' +
                    '<div></div>' +
                    '<i class="fa fa-clock-o glyphicon glyphicon-time"></i>' +
                  '</div>' +
                '</div>' +
            '</div>' +
        '</div>';

        this.submitButton = undefined;
    };

    DateRangePickerUI.prototype = {

        constructor: DateRangePickerUI,

        isTimeZoneChecked: function(compared, isSI) {

            var picker = this,
                checked_html = " checked=\"checked\"";

            var isChecked = (picker.timezone_selected && picker.timezone_selected === compared) ?  checked_html : "";

            if(!isSI) {
                return isChecked;
            }

            return (isSI && picker.timezone_selected) ? isChecked : checked_html;
        },

        isInputValid: function() {

            var picker = this;

            return moment($(picker.element).val(), picker.format, true).isValid();
        },

        getDatetimeTZoffset: function(datetime, timezone) {

            var picker = this;

            return moment.tz(datetime, timezone).format(picker.format_datetimeTZoffset);
        },

        getTimezoneShortname: function(key) {

            var timezone = {
                'America/Indianapolis': 'IND',
                'America/Indiana/Indianapolis': 'IND',
                'America/Los_Angeles': 'LA',
                'Asia/Singapore': 'SG',
                'Europe/Paris': 'FR',
                'Europe/London': 'UK',
                'Europe/Rome': 'IT',
                'Etc/UTC': 'UTC',
                'UTC': 'UTC'
            };

            return timezone[key];
        },

        synchronizeTime: function(start) {

            var picker = this,
                input_value = $(picker.element).val();

            // Initialize timezone for dropdown menu
            picker.timezone_browser = moment.tz.guess();
            picker.timezone_locale = picker.timezone_browser ? picker.timezone_browser : picker.timezone_si;

            if(picker.isInputValid()) {
                // Initialize time for dropdown menu if there is initial data
                var time_si_objet = moment.tz(input_value, picker.timezone_si);
                picker.time_si = time_si_objet.format(picker.format);
                picker.time_locale = moment.tz(picker.time_si, picker.timezone_si).tz(picker.timezone_locale).format(picker.format);
                picker.time_utc = moment.utc(time_si_objet, picker.timezone_locale).format(picker.format);

            }

            // When timezone change in dropdown, reinitialize all information: input value, daterangepicker, tooltip
            if(picker.timezone_selected && start && start.isValid()) {

                picker.time_utc = moment.tz(start.format(picker.format), picker.timezone_selected).tz(picker.timezone_utc).format(picker.format);
                picker.time_si = moment.tz(picker.time_utc, picker.timezone_utc).tz(picker.timezone_si).format(picker.format);
                picker.time_locale = moment.tz(picker.time_utc, picker.timezone_utc).tz(picker.timezone_locale).format(picker.format);
            }
        },

        updateDropdown: function() {

            var picker = this;

            if(!picker.isDatetimepicker) {

                return false;
            }

            function _getRadioButtonHtml(timezone, time, isSI) {

                var tzOffset = 'UTC';
                if (timezone !== picker.timezone_utc) {
                    var timeOrNow = time ? time : moment().format(picker.format);
                    var timezonedTime = moment.tz(timeOrNow, timezone).format('Z');
                    tzOffset = timezone + ' (UTC' + timezonedTime + ')';
                }

                var radio_html = '<input type="radio" id="' + picker.elementId + timezone + '" name="group_timezone_' + picker.elementId + '" value="' + time + '" data="' + timezone + '"' + picker.isTimeZoneChecked(timezone, isSI) + '/>';
                var label_html = '<label for="' + picker.elementId + timezone + '">' + tzOffset + '</label>';

                return '<li>' + radio_html + label_html + '</li>';
            }

            // Select dropdown menu option for timezone
            var date_input_group = $(picker.element).parent('.date');

            var timezone_html =
                '<a class="btn btn-default dropdown-toggle" role="button" id="dropdown_' + picker.elementId + '" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">' +
                    picker.getTimezoneShortname(picker.timezone_si) +
                '</a>' +
                '<ul class="dropdown-menu" aria-labelledby="dropdown_' + picker.elementId + '">';

            var utc_radiobutton_html = _getRadioButtonHtml(picker.timezone_utc, picker.time_utc, false);
            var si_radiobutton_html = _getRadioButtonHtml(picker.timezone_si, picker.time_si, true);
            var local_radiobutton_html = '';
                if (picker.timezone_locale !== picker.timezone_si) {
                    local_radiobutton_html = _getRadioButtonHtml(picker.timezone_locale, picker.time_locale, false);
                }

            var dropdown_html = si_radiobutton_html + local_radiobutton_html + utc_radiobutton_html;

            if (date_input_group.find('.dropdown-toggle').length === 0) {

                // Initialize dropdown menu
                date_input_group.prepend(timezone_html);
                date_input_group.find('.dropdown-menu').append(dropdown_html);
            } else {

                // Update dropdown menu with new time and timezone rechecked
                date_input_group.find('.dropdown-menu').html(dropdown_html);
            }

            $(date_input_group).find('input:radio').on('click', function() {

                var selectedTZ = $(this).attr('data'),
                    selectedTime = $(this).val(),
                    inputTime = $(picker.element).val();

                var isDifferentTZ = inputTime && inputTime !== selectedTime;

                // Update the dropdown link text
                date_input_group.find('.dropdown-toggle').text(picker.getTimezoneShortname(selectedTZ));

                if (isDifferentTZ && picker.dateValidation()) {

                    // If we change timezone in dropdown menu with value in input
                    // Update input value
                    $(picker.element).val(selectedTime);
                }

                // Reinitialize datetimepicker with the new timezone after selection in dropdown
                // no matter that there is value or no value in input
                var new_datetimepicker = new DateRangePickerUI($(picker.element), true);
                new_datetimepicker.synchronizeTime();
                new_datetimepicker.initDatetimerange(selectedTZ);
            });
        },

        initTooltipContent: function() {

            var picker = this,
                isShowTimezoneHtml = picker.isDatetimepicker && picker.time_si !== picker.time_locale;

            var tooltip_content = gettext(picker.isDatetimepicker ? gettext("Date time format") : gettext("Date format")) + ': ' + picker.format;

            if(isShowTimezoneHtml) {
                tooltip_content = tooltip_content +
                    '<br/>' + picker.timezone_si + ': ' + picker.time_si +
                    '<br/>' + picker.timezone_locale + ': ' + picker.time_locale;
            }

            return unescape(tooltip_content);
        },

        removeOtherTooltips: function(event) {

            $('[role="tooltip"]').each(function(i, el) {

                // Remove all others tooltips
                if (!$(el).hasClass($(event.target).attr('id'))) {
                    $(el).remove();
                }
            });
        },

        updateTooltip: function() {

            var picker = this;

            // Prepare tooltip
            $(picker.element).tooltip({
                track: true,
                tooltipClass: 'info date-tooltip ' + picker.elementId,
                position: {
                    my: "left bottom-30"
                },
                content: function () { // content option that overrides the default behavior to parser HTML tag: <br/>
                    return $(picker.element).attr('title');
                }
            }).attr('title', picker.initTooltipContent());

            $(picker.element).on('focusin', function(e) {

                picker.removeOtherTooltips(e);

                    try {
                        $(picker.element).tooltip('close');
                    } catch (err) {
                        // It's for the case when the input value is empty.
                        // If the tooltip isn't initialized (input value is empty, for instance) we can't call the 'close' method.
                        // So we should delete the whole tooltip.
                        $('[role="tooltip"]').remove();
                    }
            });

            $(picker.element).on('focusout', function(e) {

                $('[role="tooltip"]').remove();
            });
        },

        getRanges: function(timezone) {

            var ret = {};
            var range = [moment().tz(timezone), moment().tz(timezone)];

            if (this.isDatetimepicker) {
                ret[gettext("Now")] = range;
            }
            else {
                ret[gettext("Today")] = range;
            }

            return ret;
        },

        // Add error message if momentjs don't validate input
        dateValidation: function() {

            var picker = this,
                input_value = $(picker.element).val(),
                input_group = $(picker.element).parents('.date');

            input_group.find('.date-error').remove();

            // Create events for date/datetime input validation on button
            var invalidEvent = $.Event('daterangepicker--invalid');
            $(picker.element).on('daterangepicker--invalid', function (e) {

                picker.submitButton.addClass('daterangepicker--invalid-inactive');
                picker.submitButton.prop('disabled', true);
            });

            var validEvent = $.Event('daterangepicker--valid');
            $(picker.element).on('daterangepicker--valid', function (e) {

                if (picker.submitButton && picker.submitButton.length !== 0) {

                    // We enable the submit button if there is no date format error in the form.
                    if ($(picker.element).parents('form').find('.date-error').length === 0) {

                        picker.submitButton.removeClass('daterangepicker--invalid-inactive');
                        picker.submitButton.prop('disabled', false);
                    }
                }
            });

            if (input_value && !picker.isInputValid()) {

                var error_html = '<span class="date-error error">' + gettext("Invalid format") + '</span>';

                input_group.append(error_html);

                $(picker.element).trigger(invalidEvent);

                return false;
            } else {

                $(picker.element).trigger(validEvent);

                return true;
            }


        },

        defineSubmitButton: function() {

            var picker = this,
                submit_button = $(picker.element).parents('form').find(':submit');

            picker.submitButton = submit_button;
        },

        isToday: function(comparedDate) {

            var picker = this,
                isToday = false,
                today = moment().tz(picker.timezone_si);

            if (picker.isDatetimepicker) {

                today = moment().tz(picker.getCheckedTimezone());
            }

            if (picker.isInputValid()) {

                isToday = comparedDate.format(picker.format) === today.format(picker.format);
            }

            return isToday;
        },

        initDatetimerange: function(timezone) {

            var picker = this;

            picker.timezone_selected = timezone;

            // Disable datetime label click event in control-form
            $('label[for="' + picker.elementId + '"]').click(function(event) {
                event.preventDefault();
            });

            // Bind calendar icon click event
            picker.bindCalendarIconClickEvent();

            // Copy placeholder from hidden datetime input
            $(picker.element).attr('placeholder', picker.hiddenElement.attr('placeholder'));

            // Define generic submit button for Django form.
            // If there are errors in datetime input, we disable this submit button.
            picker.defineSubmitButton();

            $(picker.element).daterangepicker({
                'singleDatePicker': true,
                'showDropdowns': true,
                'timePicker': true,
                'timePicker24Hour': true,
                'autoUpdateInput': false,
                'locale': {
                    format: picker.format,
                    applyLabel: gettext("Apply")
                },
                ranges: picker.getRanges(timezone),
                template: picker.template
            }, function(start, end, label) {
                // When the manual autoUpdateInput is successful,
                // we update the dropdown and tooltip and remove the error message
                picker.element = this.element;
                picker.timezone_selected = timezone;
                picker.synchronizeTime(start);
                picker.updateDropdown();
                picker.updateTooltip();
                if (picker.isInputValid()) {
                    picker.updateInput(this);
                }
            });

            // Only for clicking the Apply button
            $(picker.element).on('apply.daterangepicker', function(event, range_picker) {

                // Manually update the input
                $(event.target).val(range_picker.startDate.format(picker.format));

                picker.dateValidation();
                picker.synchronizeTime(moment.tz($(event.target).val(), picker.getCheckedTimezone()));
                picker.updateDropdown();
                picker.updateTooltip();
                picker.updateInput(range_picker);

                /*
                 * Temporary solution to display calendar after click range: Today
                 * issue reference: https://github.com/dangrossman/bootstrap-daterangepicker/pull/701
                 */
                if ($(range_picker.container).find('.btn:hover').size() === 0) {

                    range_picker.show();

                    // Update hidden input value for django
                    picker.updateHiddenInput($(event.target).val());
                }
            });

            $(picker.element).on('showCalendar.daterangepicker', function(event, range_picker) {

                // If it is today, the button of today should be activated.
                if (picker.isToday(range_picker.startDate)) {
                    $(range_picker.container).find('.ranges li:first').addClass('active');
                }

                $(range_picker.container).find('.ranges li:first').off('click');
                $(range_picker.container).find('.ranges li:first').on('click', function() {

                    // Manually update the input for range 'Today'
                    var today = moment().tz(picker.getCheckedTimezone());

                    $(picker.element).val(today.format(picker.format));
                    $(picker.element).trigger('change');

                    range_picker.setStartDate(today);
                    range_picker.setEndDate(today);

                    range_picker.updateView();

                    event.preventDefault();
                    return false;
                });

                /* Temporary solution for https://github.com/dangrossman/bootstrap-daterangepicker/issues/626
                 *
                 * If the selected date is in another DST (daylight saving)
                 * then the moment objects get a wrong datetime
                 *
                 * For example,
                 * when user manually type the datetime, the calendar displays time with -1 day offset
                 */
                var startDateAsMoment = moment.tz(range_picker.startDate.format(picker.format), picker.getCheckedTimezone());

                var timezoneOffset = '';

                if (picker.isInputValid() && range_picker.startDate.isValid()) {
                    timezoneOffset = startDateAsMoment.utcOffset();
                }

                if (timezoneOffset) {
                    if (!picker.timezone_utcOffset) {
                        picker.timezone_utcOffset = timezoneOffset;
                    } else if (picker.timezone_utcOffset !== timezoneOffset) {
                        range_picker.timeZone = range_picker.timeZone - (picker.timezone_utcOffset - timezoneOffset);
                        picker.timezone_utcOffset = timezoneOffset;
                    }
                }

                /*
                 * Temporary solution to hide the custom range option
                 * issue reference: https://github.com/dangrossman/bootstrap-daterangepicker/issues/594
                 */
                $('.ranges ul li:last-child').hide();

                // show time icon
                $('.glyphicon-time').show();

                picker.dateValidation();

                picker.applyAutoInput(range_picker);

                $(picker.element).on('blur', function() {
                    picker.dateValidation();
                });
            });

            // when input is empty, picker should be reinitialized
            $(picker.element).on('change', function() {
                if (!$(this).val()) {
                    var datetimepicker = new DateRangePickerUI(this, true);
                    datetimepicker.dateValidation();
                    datetimepicker.synchronizeTime();
                    datetimepicker.updateTooltip();
                    datetimepicker.initDatetimerange(picker.getCheckedTimezone());
                    datetimepicker.hiddenElement.val('');
                }
            });

            // Initialize hidden input with timezone offset for django form
            if (picker.isInputValid()) {
                picker.updateHiddenInput($(picker.element).val());
            } else {
                picker.hiddenElement.val('');
            }

            picker.submitButton.on('click', function() {
                picker.dateValidation();
            });
        },

        initDaterange: function(timezone) {
            var picker = this;

            // disable datetime label click event in control-form
            $('label[for="' + picker.elementId + '"]').click(function(event) {
                event.preventDefault();
            });

            // bind calendar icon click event
            picker.bindCalendarIconClickEvent();

            // Define generic submit button for Django form.
            // If there are errors in date input, we disable this submit button.
            picker.defineSubmitButton();

            $(picker.element).daterangepicker({
                'singleDatePicker': true,
                'showDropdowns': true,
                'timePicker': true,
                'autoUpdateInput': false,
                'locale': {
                    format: picker.format
                },
                ranges: picker.getRanges(timezone),
                template: picker.template
            }, function (start, end, label) {
                // Update the input for previous date and future date
                if ($(picker.element).val() && picker.dateValidation()) {
                    picker.updateInput(this);
                }
            });

            $(picker.element).on('apply.daterangepicker', function(event, range_picker) {

                // Manually update the input for range 'Today'
                var today = moment().tz(picker.timezone_si);
                $(event.target).val(today.format(picker.format));
                range_picker.setStartDate(today);
                range_picker.setEndDate(today);

                picker.dateValidation();
            });

            $(picker.element).on('showCalendar.daterangepicker', function(event, range_picker) {

                // If it is today, the button of today should be activated.
                if (picker.isToday(range_picker.startDate)) {
                    $(range_picker.container).find('.ranges li:first').addClass('active');
                }

                /*
                 * Timepicker is a mandatory option to display the singleDatePicker with ranges;
                 * in this case, time is not necessary to display. So we hide the time.
                 */
                $('.calendar-time').hide();

                /*
                 * Temporary solution to hide the custom range option
                 * issue reference: https://github.com/dangrossman/bootstrap-daterangepicker/issues/594
                 */
                $('.ranges ul li:last-child').hide();

                // Hide apply button and cancel button
                $(range_picker.container).find('.range_inputs').hide();

                picker.applyAutoInput(range_picker);

                picker.dateValidation();

                $(picker.element).on('blur', function() {
                    picker.dateValidation();
                });
            });

            // When input is empty, picker should be reinitialized
            $(picker.element).on('change', function() {
                if (!$(this).val()) {
                    var datepicker = new DateRangePickerUI(this, false);
                    datepicker.dateValidation();
                    datepicker.synchronizeTime();
                    datepicker.updateTooltip();
                    datepicker.initDaterange(TIME_ZONE);
                }
            });

            picker.submitButton.on('click', function() {
                picker.dateValidation();
            });
        },

        /*
         * Hack autoUpdateInput, which prevent from auto validation when the user input manually datetime
         * The user can not manually input the date by keyboard.
         * issue reference: https://github.com/dangrossman/bootstrap-daterangepicker/issues/788
         */
        applyAutoInput: function(range_picker) {

            var picker = this;

            // If the user input invalid value, the daterangepicker should be blocked. For example: "8/8/2015" or "11/8/2015 11:11"
            if (parseInt($(range_picker.container).find('.yearselect').val()) < 1900 || parseInt($(picker.element).val()) < 1900) {

                var thisYear = moment().tz(picker.timezone_si).year();
                $(range_picker.container).find('.yearselect').append('<option value="' + thisYear + '">' + thisYear + '</option>');
                $(range_picker.container).find('.yearselect').val(moment().tz(picker.timezone_si).year());
            }

            // When click on date, the input value should be updated instantly
            $(range_picker.container).find('td.available').not('.off').on('click', function() {

                picker.updateInput(range_picker);

                /*
                 * issue reference: https://github.com/dangrossman/bootstrap-daterangepicker/issues/883
                 * When singleDatePicker=true, ranges and timePickers are activated, 'autoApply' doesn't work.
                 * So we find a temporary solution to apply 'autoApply'.
                 */
                if (!picker.isDatetimepicker) {
                    range_picker.hide();
                }

                // Call 'apply.daterangepicker' to update dropdown and tooltip
                if (picker.isDatetimepicker) {
                    range_picker.clickApply();
                }
            });

            // When select year/month/hour/minute in calendar, the input value should be updated instantly
            $(range_picker.container).find('.yearselect, .monthselect, .hourselect, .minuteselect').on('change', function() {

                picker.updateInput(range_picker);

                // Call 'apply.daterangepicker' to update dropdown and tooltip
                if (picker.isDatetimepicker) {
                    range_picker.clickApply();
                }
            });

            $(range_picker.container).find('td.available.off').on('click', function() {

                picker.updateInput(range_picker, true);
            });
        },

        getCheckedTimezone: function() {

            return $('input[name="group_timezone_' + this.elementId + '"]:checked').attr('data');
        },

        updateInput: function(range_picker, isFromOffDate) {

            var picker = this,
                updated_time = picker.parseCalendarDatetime(range_picker, isFromOffDate);

            $(picker.element).val(updated_time);
            $(picker.element).trigger('change');

            // After we select year/month in calendar, the daterangepicker should be updated !
            var updated_date = moment.tz(updated_time, picker.timezone_si);
            range_picker.setStartDate(updated_date);
            range_picker.setEndDate(updated_date);

            picker.updateHiddenInput(updated_time);
        },

        // Update hidden input on format 'YYYY-MM-DD HH:mmZZ', for example "2015-09-02 00:00-0400"
        updateHiddenInput: function(updated_time) {

            var picker = this;

            if (!$(picker.element).val()) {

                return false;
            }

            var checked_value = picker.getCheckedTimezone();
            if (checked_value && updated_time) {
                picker.hiddenElement.val(picker.getDatetimeTZoffset(updated_time, checked_value));
            } else {
                picker.hiddenElement.val(updated_time);
            }
        },

        parseCalendarDatetime: function(range_picker, isFromOffDate) {
            var picker = this,
                calendar_container = range_picker.container,
                year = calendar_container.find('.yearselect').val(),
                month = parseInt(calendar_container.find('.monthselect').val()) + 1,
                date = calendar_container.find('td:hover').length > 0 ? calendar_container.find('td:hover').text() : calendar_container.find('td.active').text();

            if (!date) {
                return range_picker.startDate.format(picker.format);
            }

            // When we click previous date/future date, the input should be updated
            if (isFromOffDate) {
                if (parseInt(calendar_container.find('td:hover').text()) < 15) {
                    if (month === 12) {
                        month = 1;
                        year++;
                    } else {
                        month++;
                    }
                } else {
                    if (month === 1) {
                        month = 12;
                        year--;
                    } else {
                        month--;
                    }
                }
            }

            var updated_time = moment(year + '-' + month + '-' + date, picker.format);

            if (picker.isDatetimepicker) {
                var hour = parseInt(calendar_container.find('.hourselect').val(), 10),
                    minute = parseInt(calendar_container.find('.minuteselect').val(), 10);
                updated_time.hour(hour);
                updated_time.minute(minute);
            }

            // Update time for input value
            return updated_time.format(picker.format);
        },

        // daterangepick click event is triggered when calendar icon is clicked
        bindCalendarIconClickEvent: function() {
            $('.date .date-icon-calendar').each(function(i, el) {
                $(el).click(function () {
                    if (!$(this).attr('disabled') && !$(this).prop('disabled')) {
                        $(this).parent().children('input').trigger('click');
                    }
                });
            });
        }
    };

    // Plugin 'moment-with-locales' for traditions of calendar according to locale
    moment.locale(LANGUAGE_CODE);

    // Initialize daterangepicker
    $('._datetimerange_display').each(function(i, el) {
    var datetimepicker = new DateRangePickerUI(el, true);
        datetimepicker.synchronizeTime();
        datetimepicker.updateDropdown();
        datetimepicker.updateTooltip();
        datetimepicker.initDatetimerange(TIME_ZONE);
    });

    $('.daterange').each(function(i, el) {
        var datepicker = new DateRangePickerUI(el, false);
        datepicker.synchronizeTime();
        datepicker.updateTooltip();
        datepicker.initDaterange(TIME_ZONE);
    });
});
