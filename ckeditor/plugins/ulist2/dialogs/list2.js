/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global DOMParser, Node, flatten, Attributes, Style, Cell, getProperty, TableRowStyle, setMinMaxWidth, Row, onlyFirstLetterUpperCase, ListItem, Table, Content, Tag, List */

CKEDITOR.dialog.add("list2Dialog", function(editor) {
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
                    style: 'padding-right: 0px; margin: 0; float: left; padding-top: 0.5em;'
                }, {
                    type: 'text',
                    id: 'href',
                    style: 'padding-left: 0px; margin: 0; float: left; width: 100%;'
                }]
            }, {
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
            var node = this.getParentEditor().getSelection();
            var sel = node.getNative();
            var hrefComplete = node.getStartElement().getAttribute('href');
            var href = hrefComplete ? dropProtocol(hrefComplete) : ''; // see helpers.js for the definitions of dropProtocol() and other functions.

            this.setValueOf('tab-general', 'text', sel);
            this.setValueOf('tab-general', 'href', href);
        },

        onOk: function() {
            var linkRaw = this.getValueOf('tab-general', 'href');
            var linkText = this.getValueOf('tab-general', 'text');

            if(linkRaw){
                // if url is provided
                var link = 'http://' + encodeURI(dropProtocol(linkRaw));
                var aTagContent = linkText || link;

                var underlined = this.getValueOf('tab-general', 'underlined');
                var stylesLink = new LinkAttributes();
                stylesLink["text-decoration"] = underlined ? 'underline' : 'none';

                var aTag = editor.document.createElement('a');
                aTag.setAttribute('href', link);
                aTag.setAttribute('style', stylesLink.toString());
                aTag.setAttribute('target', '_blank');
                aTag.setHtml(aTagContent);
                editor.insertElement(aTag);
            }else{
                // url is not provided, so let's insert the linkText as a plain text

                editor.insertHtml(linkText);
            }
        }
    };
});