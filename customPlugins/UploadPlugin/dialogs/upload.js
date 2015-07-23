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

    var result = {
        title: editor.lang[this.getPluginName()].title,
        minWidth: 250,
        minHeight: 100,
        contents: [{
            id: 'tab1',
            elements: [{
                type: 'vbox',
                children: [{
                    type: 'html',
                    html: ' <form action="php/test.php"><input type="file" name="data"><input type="submit"></form>',
                    id: 'fileUpload',
                }, {
                    type: 'file',
                    id: 'upload',
                    label: editor.lang[this.getPluginName()].title,
                    //size: '20em',
                    // filebrowser: {
                    //     onShow: function() {
                    //         console.log('file browser on shouw');
                    //     },
                    //     onSelect: function(fileUrl, data) {
                    //         console.log('Successfully uploaded: ' + fileUrl);
                    //     }
                    // },
                    // 'for': ['tab1', 'upload'],
                }, {
                    type: 'fileButton',
                    id: 'fileId',
                    label: 'Upload file',
                    'for': ['tab1', 'upload'],
                    onShow: function() {
                        console.log("XXXXXXXXX");
                    },
                    onLoad: function() {
                        console.log("YYYYY");
                    },
                    filebrowser: {
                        onShow: function() {
                            console.log('file browser on shouw');
                        },
                        onSelect: function(fileUrl, data) {
                            alert('Successfully uploaded: ' + fileUrl);
                        }
                    }
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
    console.log(result);
    return result;
}

UploadPluginDialog.prototype = Object.create(AbstractDialog.prototype);

CKEDITOR.dialog.add('UploadPluginDialog', UploadPluginDialog);
