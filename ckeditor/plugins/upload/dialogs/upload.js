CKEDITOR.dialog.add('uploadDialog', function(editor) {
    return {
        title: editor.lang.common.upload,
        minWidth: 250,
        minHeight: 100,

        contents: [{
            id: 'uploadTab',
            label: 'First Tab',
            title: 'First Tab Title',
            elements: [{
                type: 'vbox',
                children: [{
                    type: 'text',
                    id: 'filepath',
                    label: 'Percorso per il file',
                    validate: function() {
                        var filePath = this.getValue();
                        if (fileExt(filePath) !== 'html') {
                            var text = 'il file deve avere l\'estensione html!';
                            CKEDITOR.document.getById('message').setHtml(text);
                            return false;
                        }
                    }
                }, {
                    type: 'html',
                    html: '<div class="warning" id="message"></div>',
                }]
            }]
        }],
        onOk: function() {
            var filePath = this.getValueOf('uploadTab', 'filepath');
            console.log(filePath);
            $.get(filePath, function(data) {
                console.log(data);
            }).fail(function() {
                console.log(filePath + ' is not found');
            })
        },
        onShow: function() {
            CKEDITOR.document.getById('message').setHtml('');
        }

    };
});