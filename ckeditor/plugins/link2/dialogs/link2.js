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
            CKEDITOR.document.getById(warningFieldId).setHtml('');
            var selection = new Selection(editor, editor.getSelection()),
                len, node, nodeType, inner, innerLen,
                text = '', href = '',
                isEnabled = false;
            selectedNodes = selection.selectedNodes; // 2-dim arrays
            len = selectedNodes.length;
            console.log(selectedNodes);
            console.log(len);
            // whether the selected node array has the form [[node]]
            if (len === 1 && selectedNodes[0].length === 1){
                node = selectedNodes[0][0];
                if (node.type === CKEDITOR.NODE_TEXT || (node.type === CKEDITOR.NODE_ELEMENT && node.getName() === 'a')){
                    isEnabled = true;
                }
            }
            // when enable the link editing:
            // 1. if selectedNodes =  [[]]
            // 2. if selectedNodes =  [[link]]
            // 3. if selectedNodes =  [[text]]
            if (len === 1) {
                inner = selectedNodes[0];
                innerLen = inner.length;
                if (len === 0) {
                    isEnabled = true;
                }
                if (innerLen === 1){
                    node = inner[0];
                    nodeType = node.type;
                    if (nodeType === CKEDITOR.NODE_TEXT) {
                         isEnabled = true;
                         text = node.getText();
                    }
                    if (nodeType === CKEDITOR.NODE_ELEMENT && node.getName() === 'a'){
                        isEnabled = true;
                        text = node.getText();
                        href = node.getAttribute('href');
                    }
                }

            }
            if (!isEnabled){
                this.getContentElement('tab-general', 'text').disable();
            }
            selectedNodes.forEach(function(arr){
                arr.forEach(function(el){
                    text = text + CKHelper.nodeString(el) + ' ';
                });
            });
            this.setValueOf('tab-general', 'text', text);
            this.setValueOf('tab-general', 'href_input_field', href);
            console.log(text);





            // rangesLen = ranges.length;
            // for (i = 0; i < rangesLen; i++){
            //     range = ranges[i];
            //     if (range.collapsed) {
            //         startElem = selection.getStartElement();
            //         if (startElem.getName() === 'a'){
            //             selectionContainer.push(startElem);
            //         }
            //     } else {
            //         startContainer = range.startContainer;
            //         endContainer = range.endContainer;
            //         startType = startContainer.type;
            //         endType   = endContainer.type;
            //         startPath = range.startPath();
            //         endPath = range.endPath();
            //         startOffset = range.startOffset;
            //         endOffset = range.endOffset;
            //         // this is to avoid selections that start in one node and finish in another
            //         // e.g. the selection is a part of a table cell and a part of another table cell.
            //         if (!startPath.compare(endPath)){
            //             CKEDITOR.document.getById(warningFieldId).setHtml('Il testo selezionato non è gestibile. Prova a ridurlo.');
            //             this.setValueOf('tab-general', 'href_input_field', '');
            //             this.setValueOf('tab-general', 'text', '');
            //             this.getContentElement('tab-general', 'text').disable();
            //             this.getContentElement('tab-general', 'href_input_field').disable();
            //             return null;
            //         }
            //         if (startContainer.equals(endContainer)){
            //              // the selection starts and finishes in the same container
            //             if (startType === CKEDITOR.NODE_TEXT){
            //                 // piece = startContainer.split(startOffset).split(endOffset - startOffset);
            //                 // startElem = piece.getPrevious();
            //                 startElem = startContainer.split(startOffset).split(endOffset - startOffset).getPrevious();
            //                 // selectionContainer.push('startElem: ');
            //                 selectionContainer.push(startElem);
            //             }
            //             if (startType === CKEDITOR.NODE_ELEMENT){
            //                 selectionContainer.push(startContainer.getChild(startOffset));
            //             }
            //         } else {
            //             // the selection starts in one container and finishes in another.
            //             // First, process the end element because usage of "split" method
            //             // might change DOM so that startOffset and endOffset might not
            //             // correspond to the modified positions of elements in DOM.
            //             if (endType === CKEDITOR.NODE_TEXT){
            //                 endElem = endContainer.split(endOffset).getPrevious();
            //                 Helper.pushBeforeLast(selectionContainer, endElem);
            //             }
            //             if (endType === CKEDITOR.NODE_ELEMENT){
            //                 if (endOffset > 0){
            //                     endElem = endContainer.getChild(endOffset - 1);
            //                     Helper.pushBeforeLast(selectionContainer, endElem);
            //                 } else {
            //                     endElem = endContainer.getParent();
            //                 }
            //             }

            //             if (startType === CKEDITOR.NODE_TEXT){
            //                 startElem = startContainer.split(startOffset);
            //             }
            //             if (startType === CKEDITOR.NODE_ELEMENT){
            //                 startElem = startContainer.getChild(startOffset);
            //             }
            //             Helper.pushBeforeLast(selectionContainer, startElem);

            //             next = startElem.getNext();
            //             isOut = !next || CKHelper.doesOverlap(next, endElem);
            //             while (!isOut && next){
            //                 Helper.pushBeforeLast(selectionContainer, next);
            //                 next = next.getNext();
            //                 isOut = !next || CKHelper.doesOverlap(next, endElem);
            //             }
            //         }

            //     }
            // }

            // toBeDisabled = selectionContainer.some(function(elem){
            //     return elem.type === CKEDITOR.NODE_ELEMENT;
            // });

            // // console.log('selection container: ', selectionContainer);
            // linkContent = CKHelper.arrayToText(selectionContainer, ' ');
            // if (selectionContainer.length === 1 && selectionContainer[0].type === CKEDITOR.NODE_ELEMENT && selectionContainer[0].getName() === 'a') {
            //     linkHref = selectionContainer[0].getAttribute('href');
            // }
            // this.setValueOf('tab-general', 'text', linkContent);
            // this.setValueOf('tab-general', 'href_input_field', Helper.dropProtocol(linkHref));
            // if (toBeDisabled){
            //     this.getContentElement('tab-general', 'text').disable();
            // }

            // // console.log('selectionContainer: ', selectionContainer);
            // // selectionContainer.forEach(function(el, ind){
            // //   console.log(ind + ': "' + CKHelper.nodeString(el) + '"');
            // // });
            // console.log('from onShow: ', selectionContainer);
            // var sel = (new Selection(editor, selection)).getNodes();
            // console.log('from Selection: ', sel);
            // console.log(sel === selectionContainer);
            // var foo1, foo2, all = selectionContainer.concat(sel);
            // all.forEach(function(el, ind){
            //     console.log(ind);
            //     foo1 = sel.some(function(el2){
            //         return el2.equals(el);
            //     });
            //     foo2 = selectionContainer.some(function(el2){
            //         return el2.equals(el);
            //     });

            //     console.log(foo1 && foo2 ? 'present in both' : CKHelper.nodeStrin(el) + (foo1 ? 'selectionContainer does not contain' : 'sel does not contain' ));
            // });

        },


        onCancel: function(){
            // clear the value of the warning field
            CKEDITOR.document.getById(warningFieldId).setHtml('');
        },


        onOk: function() {
             // clear the value of the warning field
            CKEDITOR.document.getById(warningFieldId).setHtml('');
            var linkHref, linkHrefRaw,
                linkContentRaw, isUnderlined,
                len = selectedNodes.length,
                i, link, elem, elemType, content, obj, linkStr, contLen, leader,
                isEnabled = this.getContentElement('tab-general', 'text').isEnabled();
            // user input
            linkHrefRaw = this.getValueOf('tab-general', 'href_input_field');
            linkHref = 'http://' + encodeURI(Helper.dropProtocol(linkHrefRaw));
            isUnderlined = this.getValueOf('tab-general', 'underlined');
            if (isEnabled){
                linkContentRaw = this.getValueOf('tab-general', 'text');
                link = new Link();
                link.content = new Content(linkContentRaw);
                link.setHref(linkHref);
                link.underline(isUnderlined);
                linkStr = link.toHtml();
                obj = CKEDITOR.dom.element.createFromHtml(linkStr);
                editor.insertElement(obj);
            } else {
                for (i = 0; i < len; i++){
                    elem = selectedNodes[i];
                    elemType = elem.type;
                    content = CKHelper.nodeString(elem).inflate();
                    // console.log(content);
                    if (!content.isEmpty()){
                        link = new Link();
                        contLen = content.length();
                        if (contLen === 1 && content.getFirst() instanceof Link){
                            content = content.getFirst().content;
                        }
                        link.content = content;
                        link.setHref(linkHref);
                        link.underline(isUnderlined);
                        linkStr = link.toHtml();


                        if (elemType === CKEDITOR.NODE_ELEMENT){
                            // if the inner html of the element is empty, replace the element
                            // otherwise, update its inner html content
                            if (elem.getHtml() === ''){
                                obj = CKEDITOR.dom.element.createFromHtml(linkStr);
                                obj.replace(elem);
                            } else {
                                elem.setHtml(linkStr);
                            }
                        }
                        if (elemType === CKEDITOR.NODE_TEXT){
                            obj = CKEDITOR.dom.element.createFromHtml(linkStr);
                            obj.insertAfter(elem);
                            // if the element starts with a space, then impose a single space as element text content,
                            // otherwise, set element text content to be an empty string
                            leader = elem.getText().substring(0, 1) === ' ' ? ' ' : '';
                            elem.setText(leader);
                        }
                    }
                }
            }
        }
    };
});