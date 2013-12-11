CKEDITOR.dialog.add('uploadDialog', function(editor) {
    return {
        title: editor.lang.common.upload,
        minWidth: 250,
        minHeight: 100,
        buttons: [CKEDITOR.dialog.cancelButton],
        contents: [{
            id: 'tab1',
            elements: [{
                type: 'vbox',
                children: [{
                    type: 'file',
                    label: 'Percorso1',
                    id: 'fileUpload'
                }, {
                    type: 'fileButton',
                    label: 'Percorso2',
                    'for': ['tab1', 'fileUpload'],
                    filebrowser: {
                        onSelect: function( fileUrl, data ) {
                            alert( 'Successfully uploaded: ' + fileUrl );
                        }
                    }
                }]
            }]
        }],
        onOk: function() {
        },
        onShow: function() {
            
        }

    };
});