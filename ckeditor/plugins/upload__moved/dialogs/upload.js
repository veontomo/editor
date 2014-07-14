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
                    label: 'Percorso',
                    id: 'fileUpload',
                    size: 10,
                    action: '#'
                }, {
                    type: 'fileButton',
                    label: 'Caricare',
                    'for': ['tab1', 'fileUpload'],
                    onClick: function() {
                        // adds a fictious button to submit the form and clicks it. Does not work!
                        var elem = this.getDialog().getContentElement('tab1', 'fileUpload').getElement();
                        var submitBtn = new CKEDITOR.dom.element('input');
                        submitBtn.setAttribute('type', 'submit');
                        submitBtn.setAttribute('value', 'submit');
                        submitBtn.setAttribute('id', 'pulsanteFittizio');
                        submitBtn.setAttribute('hidden', 'hidden');
                        elem.append(submitBtn);
                        $('#pulsanteFittizio').click();
                        console.log(elem);
                        this.getDialog().hide();
                        return false;
                    },
                    filebrowser: {
                        onSelect: function(fileUrl, data) {
                            alert('Successfully uploaded: ' + fileUrl);
                        }
                    }
                }]
            }]
        }],
        onOk: function() {},
        onShow: function() {}

    };
});