/*jslint plusplus: true, white: true */
/*global CKEDITOR */

/**
 * Dialog for choosing a file for file upload.
 *
 * @module  Dialogs
 * @class   UploadDialog
 */
function UploadPluginDialog(editor) {
    "use strict";
    if (!(this instanceof UploadPluginDialog)) {
        return new UploadPluginDialog(editor);
    }
    AbstractDialog.call(this, editor);

    this.setController(new CFile());

    this.setPluginName('UploadPlugin');

    return {
        title: editor.lang[this.getPluginName()].title,
        minWidth: 250,
        minHeight: 100,
        contents: [{
            id: 'tab1',
            elements: [{
                type: 'vbox',
                children: [{
                    type: 'file',
                    label: editor.lang[this.getPluginName()].title,
                    id: 'fileUpload',
                    action: function(fileUrl, data) {
                        alert('Successfully uploaded: ' + fileUrl);
                    }
                }, {
                    type: 'file',
                    id: 'upload',
                    label: editor.lang[this.getPluginName()].title,
                    size: '20em',
                    filebrowser: 'tab1:upload',
                    'for': ['tab1', 'upload'],
                }]
            }]
        }],
        onOk: function() {
            console.log("click ok");
        },

        onShow: function() {
            console.log("show");
        }

    };
}

UploadPluginDialog.prototype = Object.create(AbstractDialog.prototype);

CKEDITOR.dialog.add('UploadPluginDialog', UploadPluginDialog);
