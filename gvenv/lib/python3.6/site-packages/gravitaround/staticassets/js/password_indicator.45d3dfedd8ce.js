/* Copyright (c) Polyconseil SAS. All rights reserved. */

jQuery(function($) {

    var match_passwords = function(password_field, confirm_field) {

        var password = password_field.val();
        var confirm_value = confirm_field.val();
        var warning = confirm_field.parents('.field-wrapper').find('.pwd-dont-match');

        warning.hide();
        if (confirm_value && password && confirm_value !== password){
            warning.show();
        }
    };

    var display_password_strength = function(strength_field, score){
        var strong_tag = strength_field.find('.strong');
        var medium_tag = strength_field.find('.medium');
        var weak_tag = strength_field.find('.weak');

        strength_field.show();
        strong_tag.hide();
        medium_tag.hide();
        weak_tag.hide();

        if( score < 1 ) {
            weak_tag.show();
        } else if( score < 3 ) {
            medium_tag.show();
        } else {
            strong_tag.show();
        }
    };

    $('.password-strength').on('keyup', function() {
        var password_strength_info = $(this).parents('.field-wrapper').find('.password-strength-indicator');
        if($(this).val()) {
            var result = zxcvbn($(this).val());
            display_password_strength(password_strength_info, result.score);
        }
    });

    $('.password-confirmation').each(function(){

        var password_field;
        var confirm_field = $(this);
        var confirm_with = confirm_field.data('confirm-with');

        if(!confirm_with){
            return;
        }

        password_field = confirm_field.parents('form').find('#' + confirm_with);
        confirm_field.focusout(function(){
            match_passwords(password_field, confirm_field);
        });
        password_field.focusout(function(){
            match_passwords(password_field, confirm_field);
        });
    });

});
