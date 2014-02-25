/*jslint plusplus: true, white: true */
/*global CKEDITOR, LinkStyle, Helper, Link */

CKEDITOR.dialog.add("linkSimplified", function(editor) {
    var warningFieldId = 'linkWarning';
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
                            var warningField = CKEDITOR.document.getById(warningFieldId);
                            warningField.setHtml(editor.lang.common.invalidValue);
                        }
                        return isOk;
                    }
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
                    style: 'padding-left: 0px; margin: 0; float: left; width: 100%;',
                    "default": "descrizione del link"
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
                range = node.getRanges()[0],
                fakeDiv = editor.document.createElement('div'),
                startCont, selection,
                // assigning default values for the url attribute and the link text
                linkHref = '',
                linkContent = '';

                // console.log(node, node.getRanges(), node.getRanges().length);
                fakeDiv.append(range.cloneContents());
                selection = fakeDiv.getHtml().inflate();
                console.log(selection);
                // if (!range.collapsed) {
                //     // selection is not empty
                //     startCont = range.startContainer;
                //     // the range can start either with CKEDITOR.dom.Element or with CKEDITOR.dom.text
                //     switch (startCont.type){
                //         case CKEDITOR.NODE_ELEMENT:
                //             linkContent = startCont.getHtml();
                //             linkHref = decodeURI(Helper.dropProtocol(startCont.getAttribute('href') || ''));
                //             break;
                //         case CKEDITOR.NODE_TEXT:
                //             linkContent = startCont.getText();
                //             break;
                //     }
                // }
                console.log(selection.length(), selection.getFirst());
                linkContent = selection.length() === 1 && typeof selection.getFirst() === 'string' ? selection.getFirst() : '...';
                linkHref = selection.length() === 1 && (selection.getFirst() instanceof Link) ? selection.getFirst().getUrl() : '';
                this.setValueOf('tab-general', 'text', linkContent);
                this.setValueOf('tab-general', 'href', linkHref);
        },
        onCancel: function(){
            // clear the value of the warning field
            CKEDITOR.document.getById(warningFieldId).setHtml('');
        },

        onOk: function() {
            // clear the value of the warning field
            CKEDITOR.document.getById(warningFieldId).setHtml('');
            var node = this.getParentEditor().getSelection(),
                range = node.getRanges()[0],
                linkElement, linkHref, linkStyle, linkContent, linkHrefRaw, linkContentRaw, isUnderlined;
            // user input
            linkHrefRaw = this.getValueOf('tab-general', 'href');
            linkContentRaw = this.getValueOf('tab-general', 'text');
            isUnderlined = this.getValueOf('tab-general', 'underlined');

            linkHref = 'http://' + encodeURI(Helper.dropProtocol(linkHrefRaw));

            // the range might contain nothing (to be a collapsed one)
            if (range.collapsed){
                linkContent = linkContentRaw;
            } else {
                // the range can start either with CKEDITOR.dom.Element or with CKEDITOR.dom.text
                switch (range.startContainer.type){
                    case CKEDITOR.NODE_ELEMENT:
                        linkContent = range.startContainer.getHtml();
                        break;
                    case CKEDITOR.NODE_TEXT:
                        linkContent = range.startContainer.getText();
                        break;
                    default:
                        linkContent = '';
                }

            }
            linkStyle = new LinkStyle();
            linkStyle['text-decoration'] = isUnderlined ? 'underline' : 'none';

            linkElement = editor.document.createElement('a');
            linkElement.setAttribute('href', linkHref);
            linkElement.setAttribute('style', linkStyle.toString());
            linkElement.setHtml(linkContent);
            editor.insertElement(linkElement);

        }
    };
});