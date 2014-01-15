/*jslint plusplus: true, white: true */
/*global CKEDITOR, LinkStyle, dropProtocol */

CKEDITOR.dialog.add("linkSimplified", function(editor) {
    return {
        title: editor.lang.link.info,
        minWidth: 400,
        minHeight: 300,
        height: '20em',
        contents: [{
            id: 'tab-general',
            label: 'labelTab1',
            title: 'title tab 1',
            elements: [{
                type: 'hbox',
                widths: ['10%', '90%'],
                children: [{
                    type: 'html',
                    html: 'http://',
                    style: 'padding-right: 0px; margin: 0; float: left; padding-top: 0.5em;',
                }, {
                    type: 'text',
                    id: 'href',
                    style: 'padding-left: 0px; margin: 0; float: left; width: 100%;',
                    validate: function(){
                        var isOk = Boolean(this.getValue().trim());
                        if (!isOk){
                            var warningField = CKEDITOR.document.getById('linkWarning');
                            warningField.setHtml(editor.lang.common.invalidValue);
                        }
                        return isOk;
                    },
                    "default": 'stupid link'
                }]
            },
            {
                type: 'html',
                html: '<div id="linkWarning" style="color:red;"></div>'
            },
            {
                type: 'hbox',
                widths: ['10%', '90%'],
                children: [{
                    type: 'html',
                    html: 'Testo',
                    style: 'padding-right: 0px; margin: 0; float: left; padding-top: 0.5em;'
                }, {
                    type: 'text',
                    id: 'text',
                    style: 'padding-left: 0px; margin: 0; float: left; width: 100%;'
                }]
            }, {
                type: 'html',
                html: editor.lang.link.styles + '<br>'
            }, {
                type: 'checkbox',
                id: 'underlined',
                label: editor.lang.basicstyles.underline,
                "default": true,
            }]
        }],

        onShow: function() {
            var node = this.getParentEditor().getSelection(),
                // sel = node.getNative(),
                sel = node.getStartElement().getHtml(),
                hrefComplete = node.getStartElement().getAttribute('href'),
                // see helpers.js for the definitions of dropProtocol() and other functions.
                href = hrefComplete ? dropProtocol(hrefComplete) : '';

            // this.setValueOf('tab-general', 'text', sel);
            // this.setValueOf('tab-general', 'href', href);
        },

        onOk: function() {
            var msg,
                node = this.getParentEditor().getSelection();
                // sel = node.getNative(),
                // sel = node.getStartElement().getHtml(),
                // hrefComplete = node.getStartElement().getAttribute('href');
            switch (node.getType()){
                case CKEDITOR.SELECTION_NONE:
                    msg = 'nothing is selected';
                    break;
                case CKEDITOR.SELECTION_TEXT:
                    msg = 'text is selected';
                    break;
                case CKEDITOR.SELECTION_ELEMENT:
                    msg = 'element is selected';
                    break;
            }
            console.log(msg);

            var ranges = node.getRanges();
            console.log('selected text: ', node.getSelectedText());
            console.log('selected elem: ', node.getSelectedElement());
            console.log('ranges: ', ranges);
            console.log('ranges[0]: ', ranges[0]);
            console.log('native: ', node.getNative());


            var linkRaw = this.getValueOf('tab-general', 'href');
            var linkText = this.getValueOf('tab-general', 'text');

            if(linkRaw){
                // if url is provided
                var link = 'http://' + encodeURI(dropProtocol(linkRaw));
                var aTagContent = linkText || link;

                var underlined = this.getValueOf('tab-general', 'underlined');
                var stylesLink = new LinkStyle();
                stylesLink["text-decoration"] = underlined ? 'underline' : 'none';

                var aTag = editor.document.createElement('a');
                aTag.setAttribute('href', link);
                aTag.setAttribute('style', stylesLink.toString());
                aTag.setHtml(aTagContent);
                console.log('insertion disabled: ' + aTag);
                // editor.insertElement(aTag);
            } else {
                // url is not provided, so let's insert the linkText as a plain text
                console.log('insertion disabled: ' + linkText);
                // editor.insertHtml(linkText);
            }
        }
    };
});