/*jslint plusplus: true, white: true */
/*global CKEDITOR, CKHelper, LinkStyle, Helper, Link, Content, Selection, NEWSLETTER, FACTORY, CLink */

CKEDITOR.dialog.add("linkSimplified", function(editor) {
    var warningFieldId = 'linkWarning',
        selection;          // global variable to pass info about selection
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
                    id: 'href_input_field',
                    style: 'padding-left: 0px; margin: 0; float: left; width: 100%;',
                    validate: function(){
                        var isOk = Boolean(this.getValue().trim());
                        if (!isOk){
                            var warningField = CKEDITOR.document.getById(warningFieldId);
                            warningField.setHtml(editor.lang.common.invalidValue); }
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
                    'default': 'descrizione del link'
                }]
            },
            {
                type: 'hbox',
                widths: ['10%', '90%'],
                children: [{
                    type: 'html',
                    html: 'Titolo',
                    style: 'padding-right: 0px; margin: 0; float: left; padding-top: 0.5em;'
                }, {
                    type: 'text',
                    id: 'optionalTitle',
                    style: 'padding-left: 0px; margin: 0; float: left; width: 100%;',
                    'default': ''
                }]
            }, {
                type: 'html',
                html: editor.lang.link.styles + '<br>'
            }, {
                type: 'checkbox',
                id: 'underlined',
                label: editor.lang.basicstyles.underline,
                "default": true,
            }, {
                type: 'checkbox',
                id: 'target',
                label: editor.lang.common.targetNew,
                "default": true,
            }]
        }],

        onShow: function() {
            // console.log('starting onShow');
            selection = new Selection(editor);
            selection.absorbLink();
            var text = selection.toText(),
                href = '',
                isEnabled = selection.isEditable(),
                link;
            // console.log('selection text: ' + text);
            // console.log('selection: ', selection.nodes);
            // console.log(selection.isEditable() ? 'editable' : 'not editable');

            if (selection.startsInsideLink()){
                link = selection.getStartElement().getAscendant('a', true);
                href = link.getAttribute('href');
            }
            // if the selection is nothing but a link, then pick up its title
            if (isEnabled && !selection.isEmpty()){
                var title = selection.nodes[0][0].getAttribute('title');
                this.setValueOf('tab-general', 'optionalTitle', title);
            }

            if (!isEnabled){
                this.getContentElement('tab-general', 'text').disable();
            }
            this.setValueOf('tab-general', 'text', text);
            this.setValueOf('tab-general', 'href_input_field', Helper.dropProtocol(href));
            return null;
        },

        onCancel: function(){
            // clear the value of the warning field
            CKEDITOR.document.getById(warningFieldId).setHtml('');
        },

        onOk: function(){
            CLink.convertToLinks(this, editor, selection);
        }
    };
});