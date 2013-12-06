CKEDITOR.dialog.add('uploadDialog', function(editor) {
    return {
        title: editor.lang.common.upload,
        minWidth: 250,
        minHeight: 100,
        contents: [{
            id: 'uploadTab',
            elements: [{
                type: 'text',
                id: 'filepath',
                label: 'Percorso per il file',
                validate: function(){
                    var filePath = this.getValue();
                    alert('Name cannot be empty.' );
                    return false;
                    
                }
            }]
        }],
        onOk: function() {
            var filePath = this.getValueOf('uploadTab', 'filepath');
            console.log(filePath);
            $.get(filePath, function(data){
                console.log(data);
            }).fail(function(){
                console.log(filePath + ' is not found');
            })
        }

    };
});