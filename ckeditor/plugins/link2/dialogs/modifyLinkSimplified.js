/*jslint plusplus: true, white: true */
/*global CKEDITOR, CKHelper, LinkStyle, Helper, Link, Content */

CKEDITOR.dialog.add("modifyLinkSimplified", function(editor) {
    var warningFieldId = 'linkWarning',
        selectionContainer = []; // global variable to pass info about selection
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
            var element = editor.getSelection().getStartElement();
            if (element.type === CKEDITOR.NODE_ELEMENT && element.getName() === 'a'){
                this.setValueOf('tab-general', 'text', element.getHtml());
                this.setValueOf('tab-general', 'href_input_field', element.getAttribute('href'));
            }
        },


        onCancel: function(){
        },


        onOk: function() {
            var element = editor.getSelection().getStartElement(),
                linkHrefRaw = this.getValueOf('tab-general', 'href_input_field'),
                linkHref = 'http://' + encodeURI(Helper.dropProtocol(linkHrefRaw)),
                linkContentRaw = this.getValueOf('tab-general', 'text'),
                isUnderlined = this.getValueOf('tab-general', 'underlined');

            if (element.type === CKEDITOR.NODE_ELEMENT && element.getName() === 'a'){
                element.setHtml(linkContentRaw);
                element.setAttribute('href', linkHref);
            }
        }
    };
});