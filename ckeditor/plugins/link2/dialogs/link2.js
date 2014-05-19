/*jslint plusplus: true, white: true */
/*global CKEDITOR, CKHelper, LinkStyle, Helper, Link, Content, Selection, NEWSLETTER, FACTORY */

CKEDITOR.dialog.add("linkSimplified", function(editor) {
    var warningFieldId = 'linkWarning',
        selectedNodes = []; // global variable to pass info about selection
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
            var start = editor.getSelection().getStartElement(),
                text = '', href = '',
                isEnabled,
                selection = new Selection(editor);
            var link = start.getAscendant('a', true);
            if (link){
                selectedNodes = [[link]];
                href = link.getAttribute('href');
                text = link.getText();
            } else {
                // CKEDITOR.document.getById(warningFieldId).setHtml('');
                selectedNodes = selection.selectedNodes(); // 2-dim arrays
                text = selection.toText(' | ', ' ');
            }
            // whether selected nodes is of the form [[single element]] or [[]]
            isEnabled = (selectedNodes.length === 1 && selectedNodes[0].length <= 1) ;

            if (!isEnabled){
                this.getContentElement('tab-general', 'text').disable();
            }
            this.setValueOf('tab-general', 'text', text);
            this.setValueOf('tab-general', 'href_input_field', Helper.dropProtocol(href));
        },

        onCancel: function(){
            // clear the value of the warning field
            CKEDITOR.document.getById(warningFieldId).setHtml('');
        },

        onOk: function(){
            var isUnderlined = this.getValueOf('tab-general', 'underlined'),
                isEnabled = this.getContentElement('tab-general', 'text').isEnabled(),
                url = 'http://' + encodeURI(Helper.dropProtocol(this.getValueOf('tab-general', 'href_input_field'))),
                current, link, obj,
                factory = FACTORY.factory;

            // if the selectedNode is empty: [[]].
            if (selectedNodes.length === 1 && selectedNodes[0].length === 0){
                console.log('selected nodes are empty');
                link = new Link();
                link.setHref(url);
                link.underline(isUnderlined);
                link.setContent(new Content(this.getValueOf('tab-general', 'text')));
                // control whether the current position is inside a link
                current = editor.getSelection().getStartElement();
                if(current.getName() === 'a'){
                    obj = CKEDITOR.dom.element.createFromHtml(link.toHtml());
                    obj.replace(current);
                } else {
                    editor.insertHtml(link.toHtml());
                }
            } else {
                console.log('selected nodes are not empty');
                var nodes = [];
                // parse all selected nodes
                selectedNodes.forEach(function(arr, ind){
                    arr.forEach(function(el, ind2){
                        console.log(ind + ' ' + ind2);
                        var newNode, objLink;
                            // parent = el.$.parentNode;
                        // prepare Link object
                        link = new Link();
                        link.setHref(url);
                        link.underline(isUnderlined);
                        obj = factory.mimic(el.$);
                        if (obj &&  !obj.isEmpty()){
                            console.log('considering obj: ' + obj.toHtml());
                            objLink = link.apply(obj);
                            console.log('its apply: ' + objLink.toHtml());
                            newNode = objLink.toNode();
                            console.log('inserting newNode: ', newNode.outerHTML);
                            el.$.parentNode.replaceChild(newNode, el.$);
                            // nodes.push(newNode);
                        }
                    });
                });
                // console.log(nodes);
            }
        }
    };
});