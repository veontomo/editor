/*jslint plusplus: true, white: true */
/*global CKEDITOR, CKHelper, LinkStyle, Helper, Link, Content */

CKEDITOR.dialog.add("linkSimplified", function(editor) {
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
            CKEDITOR.document.getById(warningFieldId).setHtml('');
            selectionContainer = []; // resetting
            var selection = this.getParentEditor().getSelection(),
                ranges = selection.getRanges(),
                startContainer, endContainer,
                startOffset, endOffset,
                range,
                startPath, endPath, startElem, endElem,
                startType, endType,
                linkHref  = '',
                linkContent = '',
                i, rangesLen, next,
                isOut = false, toBeDisabled;

            rangesLen = ranges.length;
            for (i = 0; i < rangesLen; i++){
                range = ranges[i];
                if (range.collapsed) {
                    continue;
                }
                startContainer = range.startContainer;
                endContainer = range.endContainer;
                startType = startContainer.type;
                endType   = endContainer.type;
                startPath = range.startPath();
                endPath = range.endPath();
                startOffset = range.startOffset;
                endOffset = range.endOffset;
                // console.log('start container: ', startContainer, ', start offset: ', startOffset, ', start type: ', startType);
                // console.log('end container: ', endContainer, ', end offset: ', endOffset, ', end type: ', endType);
                // console.log('end container children: ', endContainer.getChildren());

                // this is to avoid selections that start in one node and finish in another
                // e.g. the selection is a part of a table cell and a part of another table cell.
                if (!startPath.compare(endPath)){
                    CKEDITOR.document.getById(warningFieldId).setHtml('Il testo selezionato non è gestibile. Prova a ridurlo.');
                    this.setValueOf('tab-general', 'href_input_field', '');
                    this.setValueOf('tab-general', 'text', '');
                    this.getContentElement('tab-general', 'text').disable();
                    this.getContentElement('tab-general', 'href_input_field').disable();
                    return null;
                }
                if (startContainer.equals(endContainer)){
                     // the selection starts and finishes in the same container
                    if (startType === CKEDITOR.NODE_TEXT){
                        // piece = startContainer.split(startOffset).split(endOffset - startOffset);
                        // startElem = piece.getPrevious();
                        startElem = startContainer.split(startOffset).split(endOffset - startOffset).getPrevious();
                        // selectionContainer.push('startElem: ');
                        selectionContainer.push(startElem);
                    }
                    if (startType === CKEDITOR.NODE_ELEMENT){
                        selectionContainer.push(startContainer.getChild(startOffset));
                    }
                } else {
                    // the selection starts in one container and finishes in another.
                    // First, process the end element because usage of "split" method
                    // might change DOM so that startOffset and endOffset might not
                    // correspond to the modified positions of elements in DOM.
                    if (endType === CKEDITOR.NODE_TEXT){
                        endElem = endContainer.split(endOffset).getPrevious();
                        Helper.pushBeforeLast(selectionContainer, endElem);
                    }
                    if (endType === CKEDITOR.NODE_ELEMENT){
                        if (endOffset > 0){
                            endElem = endContainer.getChild(endOffset - 1);
                            Helper.pushBeforeLast(selectionContainer, endElem);
                        } else {
                            endElem = endContainer.getParent();
                        }
                    }

                    if (startType === CKEDITOR.NODE_TEXT){
                        startElem = startContainer.split(startOffset);
                    }
                    if (startType === CKEDITOR.NODE_ELEMENT){
                        startElem = startContainer.getChild(startOffset);
                    }
                    Helper.pushBeforeLast(selectionContainer, startElem);

                    // selectionContainer.push('endElem: ');
                    // selectionContainer.push(endElem);

                    next = startElem.getNext();
                    isOut = !next || CKHelper.doesOverlap(next, endElem);
                    while (!isOut && next){
                        Helper.pushBeforeLast(selectionContainer, next);
                        next = next.getNext();
                        isOut = !next || CKHelper.doesOverlap(next, endElem);
                    }
                }
            }

            toBeDisabled = selectionContainer.some(function(elem){
                return elem.type === CKEDITOR.NODE_ELEMENT;
            });

            // console.log('selection container: ', selectionContainer);
            linkContent = CKHelper.arrayToText(selectionContainer, ' ');
            // fakeDiv.append(ranges[0].cloneContents());
            // linkContent = selectionObj.toText();
            if (selectionContainer.length === 1 && selectionContainer[0].type === CKEDITOR.NODE_ELEMENT && selectionContainer[0].getName() === 'a') {
                linkHref = selectionContainer[0].getAttribute('href');
            }
            this.setValueOf('tab-general', 'text', linkContent);
            this.setValueOf('tab-general', 'href_input_field', Helper.dropProtocol(linkHref));
            if (toBeDisabled){
                this.getContentElement('tab-general', 'text').disable();
            }
        },


        onCancel: function(){
            // clear the value of the warning field
            CKEDITOR.document.getById(warningFieldId).setHtml('');
        },

        // onOk: function() {
        //     console.log('onOK: ', selectionContainer);
        //     console.log(this.getContentElement('tab-general', 'text').isEnabled());
        //     // clear the value of the warning field
        //     CKEDITOR.document.getById(warningFieldId).setHtml('');
        //     var node = this.getParentEditor().getSelection(),
        //         range = node.getRanges()[0],
        //         fakeDiv = editor.document.createElement('div'),
        //         linkElement, linkHref, linkStyle, linkContent, linkHrefRaw, linkContentRaw, isUnderlined, selection;
        //     // user input
        //     linkHrefRaw = this.getValueOf('tab-general', 'href_input_field');
        //     linkContentRaw = this.getValueOf('tab-general', 'text');
        //     isUnderlined = this.getValueOf('tab-general', 'underlined');

        //     fakeDiv.append(range.cloneContents());
        //     selection = fakeDiv.getHtml().inflate();
        //     linkContent = selection.toText();

        //     console.log(selection);
        //     linkHref = 'http://' + encodeURI(Helper.dropProtocol(linkHrefRaw));

        //     // the range might contain nothing (to be a collapsed one)
        //     if (range.collapsed){
        //         linkContent = linkContentRaw;
        //     } else {
        //         // the range can start either with CKEDITOR.dom.Element or with CKEDITOR.dom.text
        //         switch (range.startContainer.type){
        //             case CKEDITOR.NODE_ELEMENT:
        //                 linkContent = range.startContainer.getHtml();
        //                 break;
        //             case CKEDITOR.NODE_TEXT:
        //                 linkContent = range.startContainer.getText();
        //                 break;
        //             default:
        //                 linkContent = '';
        //         }

        //     }
        //     linkStyle = new LinkStyle();
        //     linkStyle['text-decoration'] = isUnderlined ? 'underline' : 'none';

        //     linkElement = editor.document.createElement('a');
        //     linkElement.setAttribute('href', linkHref);
        //     linkElement.setAttribute('style', linkStyle.toString());
        //     // linkElement.setHtml(linkContent);
        //     // editor.insertElement(linkElement);

        // }

        onOk: function() {
            console.log('onOK: ', selectionContainer);
            // clear the value of the warning field
            CKEDITOR.document.getById(warningFieldId).setHtml('');
            var linkHref, linkHrefRaw,
                linkContentRaw, isUnderlined,
                len = selectionContainer.length,
                i, link, elem, elemType, content, obj, linkStr, contLen,
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
                    elem = selectionContainer[i];
                    elemType = elem.type;
                    content = CKHelper.nodeString(elem).inflate();
                    console.log(content);
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
                        console.info('insert', linkStr);
                        obj = CKEDITOR.dom.element.createFromHtml(linkStr);
                        obj.insertAfter(elem);
                        if (elemType === CKEDITOR.NODE_ELEMENT){
                            elem.remove();
                        }
                        if (elemType === CKEDITOR.NODE_TEXT){
                            elem.setText('');
                        }
                    }
                }
            }
        }
    };
});