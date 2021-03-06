define([
    'jquery',
    'underscore',
    'backbone',
    'common'
], function($, _, Backbone, Common) {
    'use strict';

    var FolderShareItemView = Backbone.View.extend({
        tagName: 'tr',

        template: _.template($('#folder-perm-item-tmpl').html()),

        initialize: function(options) {
            this.item_data = options.item_data;
            this.repo_id = options.repo_id;
            this.path = options.path;

            this.render();
        },

        render: function () {
            this.$el.html(this.template(this.item_data));
            return this;
        },

        events: {
            'mouseenter': 'showOpIcons',
            'mouseleave': 'hideOpIcons',
            'click .perm-edit-icon': 'editIconClick',
            'change .perm-toggle-select': 'editPerm',
            'click .delete-icon': 'del'
        },

        showOpIcons: function () {
            this.$el.find('.op-icon').removeClass('vh');
        },

        hideOpIcons: function () {
            this.$el.find('.op-icon').addClass('vh');
        },

        editIconClick: function (e) {
            $(e.currentTarget).closest('td')
                .find('.perm').addClass('hide').end()
                .find('.perm-toggle-select').removeClass('hide');

            return false;
        },

        editPerm: function (e) {
            var _this = this;
            var item_data = this.item_data;
            var url = Common.getUrl({
                    name: 'dir_shared_items',
                    repo_id: this.repo_id
                }) + '?p=' + encodeURIComponent(this.path);
            if (item_data.for_user) {
                url += '&share_type=user&username=' + encodeURIComponent(item_data.user);
            } else {
                url += '&share_type=group&group_id=' + encodeURIComponent(item_data.group_id);
            }
            var perm = $(e.currentTarget).val();
            $.ajax({
                url: url,
                dataType: 'json',
                method: 'POST',
                beforeSend: Common.prepareCSRFToken,
                data: {
                    'permission': perm
                },
                success: function () {
                    item_data.perm = perm;
                    _this.render();
                },
                error: function(xhr) {
                    var err_msg;
                    if (xhr.responseText) {
                        err_msg = gettext("Edit failed");
                    } else {
                        err_msg = gettext("Failed. Please check the network.");
                    }
                    if (item_data.for_user) {
                        $('#dir-user-share .error').html(err_msg).removeClass('hide');
                    } else {
                        $('#dir-group-group .error').html(err_msg).removeClass('hide');
                    }
                }
            });
        },

        del: function () {
            var _this = this;
            var item_data = this.item_data;
            var url = Common.getUrl({
                    name: 'dir_shared_items',
                    repo_id: this.repo_id
                }) + '?p=' + encodeURIComponent(this.path);
            if (item_data.for_user) {
                url += '&share_type=user&username=' + encodeURIComponent(item_data.user);
            } else {
                url += '&share_type=group&group_id=' + encodeURIComponent(item_data.group_id);
            }
            $.ajax({
                url: url,
                dataType: 'json',
                method: 'DELETE',
                beforeSend: Common.prepareCSRFToken,
                success: function () {
                    _this.remove();
                },
                error: function (xhr) {
                    var err_msg;
                    if (xhr.responseText) {
                        err_msg = gettext("Delete failed");
                    } else {
                        err_msg = gettext("Failed. Please check the network.");
                    }
                    if (item_data.for_user) {
                        $('#dir-user-share .error').html(err_msg).removeClass('hide');
                    } else {
                        $('#dir-group-group .error').html(err_msg).removeClass('hide');
                    }
                }
            });

            return false;
        }

    });

    return FolderShareItemView;
});
