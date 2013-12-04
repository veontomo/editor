CKEDITOR.dialog.add("linkSimplified", function(editor) {

    /**
     * Deletes the protocol name from the url.
     * Everything until the first occurence of '://' will be removed (inclusively).
     * @example  'http://www.test.com'      -> 'www.test.com'
     *           'www.test.com'             -> 'www.test.com'
     * @param    url     String
     * @return   String  url without protocol name
     */
    var dropProtocol = function(str){
        var delimiter = '://';
        var pattern = '^[^' + delimiter + ']+' + delimiter; 
        var re = new RegExp(pattern, 'gi');
        return str.replace(re, '');
    };

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
            var href = dropProtocol(node.getStartElement().getAttribute('href'));

            this.setValueOf('tab-general', 'text', sel);
            this.setValueOf('tab-general', 'href', href);
        },

        onOk: function() {
            var linkRaw = this.getValueOf('tab-general', 'href');

            if(linkRaw){
                var link = 'http://' + encodeURI(dropProtocol(linkRaw));
                var linkText = this.getValueOf('tab-general', 'text');
                var aTagContent = linkText ? linkText : link;

                var underlined = this.getValueOf('tab-general', 'underlined');
                var stylesLink = new LinkAttributes();
                stylesLink["text-decoration"] = underlined ? 'underline' : 'none';

                var aTag = editor.document.createElement('a');
                aTag.setAttribute('href', link);
                aTag.setAttribute('style', stylesLink.toString());
                aTag.setAttribute('target', '_blank');
                aTag.setHtml(aTagContent);                
                editor.insertElement(aTag);
            }
        }
    };
});


CKEDITOR.dialog.add("unlinkSimplified", function(editor) {
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
            var sel = this.getParentEditor().getSelection().getNative();
            this.setValueOf('tab-general', 'text', sel);
        },

        onOk: function() {
            // user input
            var linkRaw = this.getValueOf('tab-general', 'href');
            var linkText = this.getValueOf('tab-general', 'text');
            var underlined = this.getValueOf('tab-general', 'underlined');

            var link = 'http://' + linkRaw.replace(/http:\/\//i, '');

            var stylesLink = new LinkAttributes();
            stylesLink["text-decoration"] = underlined ? 'underline' : 'none';
            var aTag = editor.document.createElement('a');
            aTag.setAttribute('href', link);
            aTag.setAttribute('style', stylesLink.toString());
            aTag.setAttribute('target', '_blank');
            aTag.setHtml(linkText);

/*            // what to insert into <a href=""> ... </a>
            var sel = this.getParentEditor().getSelection().getNative();
            var aTagContent = sel ? sel : link;
            console.log('aTagContent: ' + aTagContent);
            aTag.setHtml(aTagContent);
*/
            editor.insertElement(aTag);
        }
    };
});