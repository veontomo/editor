/*jslint plusplus: true, white: true */
/*global CKEDITOR, CKHelper, LinkStyle, Helper, Link, Content, Selection */

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
            console.log('onShow: ');
            // CKEDITOR.document.getById(warningFieldId).setHtml('');
            var selection = new Selection(editor, editor.getSelection()),
                len, node, nodeType, inner, innerLen,
                text = '', href = '', current,
                isEnabled = false;
            selectedNodes = selection.selectedNodes; // 2-dim arrays
            len = selectedNodes.length;
            // when enable the link editing:
            // 1. if selectedNodes =  [[]]
            // 2. if selectedNodes =  [[link]]
            // 3. if selectedNodes =  [[text]]
            if (len === 1) {
                inner = selectedNodes[0];
                innerLen = inner.length;
                if (innerLen === 0) {
                    // nothing is selected. Control whether the current position is inside a link
                    isEnabled = true;
                    current = editor.getSelection().getStartElement();
                    if(current.getName() === 'a'){
                        href = current.getAttribute('href');
                        text = current.getText();
                    }
                }
                if (innerLen === 1){
                    node = inner[0];
                    nodeType = node.type;
                    if (nodeType === CKEDITOR.NODE_TEXT) {
                         isEnabled = true;
                         // getParent is always CKEDITOR.dom.element
                         if (node.getParent().getName() === 'a'){
                            href = node.getParent().getAttribute('href');
                         }
                    }
                    if (nodeType === CKEDITOR.NODE_ELEMENT && node.getName() === 'a'){
                        isEnabled = true;
                        href = node.getAttribute('href');
                    }
                }
            }
            // collecting text info
            selectedNodes.forEach(function(arr){
                arr.forEach(function(el){
                    if (el.type === CKEDITOR.NODE_TEXT || el.type === CKEDITOR.NODE_ELEMENT){
                        text = text + el.getText() + ' ';
                    }

                });
            });
            if (!isEnabled){
                this.getContentElement('tab-general', 'text').disable();
            }
            this.setValueOf('tab-general', 'text', text);
            this.setValueOf('tab-general', 'href_input_field', Helper.dropProtocol(href));
        },

        onOK: function(){
           console.log('onOK: ');
       },

        onCancel: function(){
            // clear the value of the warning field
            CKEDITOR.document.getById(warningFieldId).setHtml('');
            console.log('onCancel: ', selectedNodes);
        },

        // onOK: function(){
        //     console.log('onOK: ');
        //     return true;
        //     // editor.insertHtml('<div>ssssss</div>');

        //     // var isUnderlined = this.getValueOf('tab-general', 'underlined'),
        //     //     isEnabled = this.getContentElement('tab-general', 'text').isEnabled(),
        //     //     url = 'http://' + encodeURI(Helper.dropProtocol(this.getValueOf('tab-general', 'href_input_field'))),
        //     //     current, link, obj;
        //     // if (selectedNodes.length === 1 && selectedNodes[0].length === 0){
        //     //     link = new Link();
        //     //     current = editor.getSelection().getStartElement();
        //     //     if(current.getName() === 'a'){
        //     //         link.setHref(url);
        //     //         link.underline(isUnderlined);
        //     //         link.content = new Content(this.getValueOf('tab-general', 'text'));
        //     //         // console.log(link.toHtml());
        //     //         obj = CKEDITOR.dom.element.createFromHtml(link.toHtml());
        //     //         // obj.replace(current);
        //     //         current.remove();
        //     //     }
        //     // }
        // }

    };
});


// onOk_old: function() {
//      // clear the value of the warning field
//     // CKEDITOR.document.getById(warningFieldId).setHtml('');
//     var linkHref, linkHrefRaw,
//         linkContentRaw, isUnderlined,
//         len = selectedNodes.length,
//         i, link, elem, elemType, content, obj, linkStr, contLen, leader,
//         isEnabled = this.getContentElement('tab-general', 'text').isEnabled();
//     // user input
//     linkHrefRaw = this.getValueOf('tab-general', 'href_input_field');
//     linkHref = 'http://' + encodeURI(Helper.dropProtocol(linkHrefRaw));
//     isUnderlined = this.getValueOf('tab-general', 'underlined');
//     if (isEnabled){
//         linkContentRaw = this.getValueOf('tab-general', 'text');
//         link = new Link();
//         link.content = new Content(linkContentRaw);
//         link.setHref(linkHref);
//         link.underline(isUnderlined);
//         linkStr = link.toHtml();
//         obj = CKEDITOR.dom.element.createFromHtml(linkStr);
//         editor.insertElement(obj);
//     } else {
//         for (i = 0; i < len; i++){
//             elem = selectedNodes[i];
//             elemType = elem.type;
//             content = CKHelper.nodeString(elem).inflate();
//             // console.log(content);
//             if (!content.isEmpty()){
//                 link = new Link();
//                 contLen = content.length();
//                 if (contLen === 1 && content.getFirst() instanceof Link){
//                     content = content.getFirst().content;
//                 }
//                 link.content = content;
//                 link.setHref(linkHref);
//                 link.underline(isUnderlined);
//                 linkStr = link.toHtml();


//                 if (elemType === CKEDITOR.NODE_ELEMENT){
//                     // if the inner html of the element is empty, replace the element
//                     // otherwise, update its inner html content
//                     if (elem.getHtml() === ''){
//                         obj = CKEDITOR.dom.element.createFromHtml(linkStr);
//                         obj.replace(elem);
//                     } else {
//                         elem.setHtml(linkStr);
//                     }
//                 }
//                 if (elemType === CKEDITOR.NODE_TEXT){
//                     obj = CKEDITOR.dom.element.createFromHtml(linkStr);
//                     obj.insertAfter(elem);
//                     // if the element starts with a space, then impose a single space as element text content,
//                     // otherwise, set element text content to be an empty string
//                     leader = elem.getText().substring(0, 1) === ' ' ? ' ' : '';
//                     elem.setText(leader);
//                 }
//             }
//         }
//     }
// }
