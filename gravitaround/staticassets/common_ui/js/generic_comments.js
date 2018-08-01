/**
 * Generic django comment on any object.
 *
 * Button to popup the comment history and new comment form:
 *
 * <a data-add-comment-url="{% url 'sales_long_rentals_add_comment' %}"
 *    data-get-comments-url="{% url 'sales_long_rentals_get_comments' %}"
 *    data-instance-pk="{{ card.pk }}" class="comment-button">
 *     {% trans "Historic" %}
 * </a>
 *
 * Display the last comment:
 *
 * <div id="comment-{{ rental.pk }}">
 *   {% with last_comment=rental.comments.latest %}
 *   {{ last_comment.comment|default:_("No comments") }}
 *   {% endwith %}
 * </div>
 *
 */
/* global gettext, jQuery */
;(function($, window, undefined) {
    "use strict";

    var pluginName = 'genericCommentDialog';
    var defaults = {
        autoOpen:   false,
        buttons:    {},
        draggable:  false,
        maxHeight:  600,
        modal:      true,
        position:   'top',
        resizable:  true,
        title:      gettext("History and add comment"),
        width:      420
    };

    /**
     * GenericCommentPlugin constructor.
     *
     */
    function GenericCommentPlugin(element, options) {
        this.element = element;
        this.options = $.extend( {}, defaults, options) ;
        this._defaults = defaults;
        this._name = pluginName;
        this.init(element, options);
    }

    /**
     * GenericCommentPlugin initialization. Will register an onclick event on
     * the current button to build and display the form within a form dialog.
     *
     */
    GenericCommentPlugin.prototype.init = function init(element, options) {
        var self = this;
        $(element).click(function onCommentButtonClick(event) {
            var dialogContent = self.buildDialog($(this).data('instance-pk'));
            self.setUpDialog(dialogContent, $(this).data('add-comment-url'), $(this).data('get-comments-url'));
            dialogContent.dialog('open');
            event.preventDefault();
        });
    };

    /**
     * Builds the comment form
     *
     */
    GenericCommentPlugin.prototype.buildDialog = function buildDialog(instancePk) {
        return $('<div>').attr('class', 'comment-dialog').append(
            $('<div>').attr('class', 'comment-history'),
            $('<form>').attr({
                'name': 'comment-form',
                'class': 'comment-form'
            }).append(
                $('<input>').attr({
                    'type': 'hidden',
                    'name': 'pk',
                    'value': instancePk
                }),
                $('<textarea>').attr('name', 'comment')
            )
        );
    };

    GenericCommentPlugin.prototype.setUpDialog = function setUpDialog(dialogContent, add_comment_url, get_comments_url) {
        var options = this.options || {};
        // Comment button
        options.buttons[gettext('Add a comment')] = function onComment() {
            var comment = dialogContent.find('.comment-form textarea[name="comment"]').val();
            var pk = dialogContent.find('.comment-form input[name="pk"]').val();
            var dialog = this;
            $.post(
                add_comment_url,
                dialogContent.find('.comment-form').serialize(),
                function(result) {
                    $('#comment-' + pk).html(comment);
                    $(dialog).dialog('close');
                }.bind([dialog, comment, pk])
            );
        };
        // Cancel button
        options.buttons[gettext('Cancel')] = function onCancel() {
            $(this).dialog('close');
        };
        // open handler
        options.open = function onDialogOpen() {
            var pk = $(this).find('input[name="pk"]').val();
            $.get(get_comments_url, {
                pk: pk
            }, function onDataReceived(comments) {
                for (var idx in comments) {
                    dialogContent.find('.comment-history').append($('<div>').append(
                        $('<span>').addClass('comment-date').html(comments[idx].date + ' '),
                        $('<span>').addClass('comment-user').html(comments[idx].user),
                        $('<span>').addClass('comment-text').html(comments[idx].comment),
                        $('<hr>')
                    ));
                }
            });
        };
        // close handler
        options.close = function onDialogClose() {
            dialogContent.find('input[name="pk"]').val('');
            dialogContent.find('.comment-form textarea[name="comment"]').val('');
            dialogContent.find('.comment-history').empty();
        };
        // Apply the dialog behavior to the element
        dialogContent.dialog(options);
    };

    $.fn[pluginName] = function attachPlugin(options) {
        return this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new GenericCommentPlugin(this, options));
            }
        });
    };
}(jQuery, window));
