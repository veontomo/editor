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
                    "default": 'www.stupid.link'
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
            // var node = this.getParentEditor().getSelection(),
                // sel = node.getNative(),
                // sel = node.getStartElement().getHtml(),
                // hrefComplete = node.getStartElement().getAttribute('href'),
                // see helpers.js for the definitions of dropProtocol() and other functions.
                // href = hrefComplete ? dropProtocol(hrefComplete) : '';

            // this.setValueOf('tab-general', 'text', sel);
            // this.setValueOf('tab-general', 'href', href);
        },

        onOk: function() {
            var node = this.getParentEditor().getSelection(),
                range = node.getRanges()[0],
                linkElement, linkHref, linkStyle, linkContent, linkHrefRaw, linkContentRaw, isUnderlined;
            // user input
            linkHrefRaw = this.getValueOf('tab-general', 'href');
            linkContentRaw = this.getValueOf('tab-general', 'text');
            isUnderlined = this.getValueOf('tab-general', 'underlined');

            linkHref = 'http://' + encodeURI(dropProtocol(linkHrefRaw));

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