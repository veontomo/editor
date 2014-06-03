/*jslint plusplus: true, white: true */
/*global CKEDITOR, CKHelper, LinkStyle, Helper, Link, Content, Selection, NEWSLETTER, FACTORY */

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
            var isUnderlined = this.getValueOf('tab-general', 'underlined'),
                isEnabled = this.getContentElement('tab-general', 'text').isEnabled(),
                url = 'http://' + encodeURI(Helper.dropProtocol(this.getValueOf('tab-general', 'href_input_field'))),
                // current,
                link, obj,
                factory = FACTORY.factory;

            // if selection is empty
            if (selection.isEmpty()){
                link = new Link();
                link.setHref(url);
                link.underline(isUnderlined);
                link.setContent(new Content(this.getValueOf('tab-general', 'text')));
                editor.insertHtml(link.toHtml());
            } else {
                // parse all selected nodes
                selection.nodes.forEach(function(arr){
                    arr.forEach(function(el){
                        var newNode, objLink;
                        link = new Link();
                        link.setHref(url);
                        link.underline(isUnderlined);
                        obj = factory.mimic(el.$);
                        if (obj &&  !obj.isEmpty()){
                            if (obj && typeof obj.setAttrProperty === 'function'){
                                obj.setAttrProperty('data-cke-saved-href', url);    // CKeditor remembers this attr and replaces proper url
                                                                                    // by this one.
                            }
                            objLink = link.apply(obj);
                            newNode = objLink.toNode();
                            el.$.parentNode.replaceChild(newNode, el.$);
                        }
                    });
                });
            }
        }
    };
});