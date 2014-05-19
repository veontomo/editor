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
                // len, node, nodeType, inner, innerLen, current,
                text = '', href = '',
                isEnabled = false;
            var link = start.getAscendant('a', true);
            if (link){
                console.log('link is found among parents');
                selectedNodes = [[link]];
                href = link.getAttribute('href');
                text = link.getText();
            } else {
                console.log('no link is found among parents');
                // CKEDITOR.document.getById(warningFieldId).setHtml('');
                var selection = new Selection(editor);
                selectedNodes = selection.selectedNodes(); // 2-dim arrays
                text = selection.toText(' | ', ' ');
                // len = selectedNodes.length;


                // when enable the link editing:
                // 1. if selectedNodes =  [[]]
                // 2. if selectedNodes =  [[link]]
                // 3. if selectedNodes =  [[text]]
                // if (len === 1) {
                //     inner = selectedNodes[0];
                //     innerLen = inner.length;
                //     if (innerLen === 0) {
                //         // nothing is selected. Control whether the current position is inside a link
                //         isEnabled = true;
                //         current = editor.getSelection().getStartElement();
                //         if(current.getName() === 'a'){
                //             href = current.getAttribute('href');
                //             text = current.getText();
                //         }
                //     }
                //     if (innerLen === 1){
                //         node = inner[0];
                //         nodeType = node.type;
                //         if (nodeType === CKEDITOR.NODE_TEXT) {
                //              isEnabled = true;
                //              // getParent is always CKEDITOR.dom.element
                //              if (node.getParent().getName() === 'a'){
                //                 href = node.getParent().getAttribute('href');
                //              }
                //         }
                //         if (nodeType === CKEDITOR.NODE_ELEMENT && node.getName() === 'a'){
                //             isEnabled = true;
                //             href = node.getAttribute('href');
                //         }
                //     }
                // }
            }
            // collecting text info
            // selectedNodes.forEach(function(arr){
            //     arr.forEach(function(el){
            //         if (el.type === CKEDITOR.NODE_TEXT || el.type === CKEDITOR.NODE_ELEMENT){
            //             text = text + el.getText() + ' ';
            //         }

            //     });
            // });

            if (!isEnabled){
                this.getContentElement('tab-general', 'text').disable();
            }
            this.setValueOf('tab-general', 'text', text);
            this.setValueOf('tab-general', 'href_input_field', Helper.dropProtocol(href));
            // console.log('link2, method onShow has finished');
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
                var nodes = [];
                // parse all selected nodes
                selectedNodes.forEach(function(arr){
                    arr.forEach(function(el){
                        var newNode, objLink;
                            // parent = el.$.parentNode;
                        // prepare Link object
                        link = new Link();
                        link.setHref(url);
                        link.underline(isUnderlined);
                        obj = factory.mimic(el.$);
                        if (obj &&  !obj.isEmpty()){
                            objLink = link.linkify(obj);
                            newNode = objLink.toNode();
                            el.$.parentNode.replaceChild(newNode, el.$);
                            nodes.push(newNode);
                        }
                    });
                });
            }
        }
    };
});