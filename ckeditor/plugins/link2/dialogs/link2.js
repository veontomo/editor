/*jslint plusplus: true, white: true */
/*global CKEDITOR, CKHelper, LinkStyle, Helper, Link */

CKEDITOR.dialog.add("linkSimplified", function(editor) {
    var warningFieldId = 'linkWarning',
        selection; // global variable to pass info about selection
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

        // onShow: function() {
        //     selection = this.getParentEditor().getSelection();
        //     var ranges = selection.getRanges(),
        //         range,
        //         startContainer,
        //         endContainer,
        //         startType,
        //         endType,
        //         fakeDiv = editor.document.createElement('div'),
        //         linkHref = '',
        //         selectionObj, linkContent, len, elem, i, rangesLen, next, counter;
        //     rangesLen = ranges.length;
        //     console.log('onShow selection: ', selection);
        //     console.log('ranges length: ', rangesLen);
        //     for (i = 0; i < rangesLen; i++){
        //         range = ranges[i];
        //         console.log('loop over ranges: #', i+1, ' of total ', rangesLen);

        //         startContainer = range.startContainer;
        //         endContainer = range.endContainer;
        //         startType = startContainer.type;
        //         endType = endContainer.type;
        //         console.log('start container: ', startContainer, ', start offset: ', range.startOffset, ', string: ', CKHelper.nodeOffsetString(startContainer, range.startOffset, 'end'));
        //         console.log('end container: ', endContainer, ', end offset: ', range.endOffset, ', string: ', CKHelper.nodeOffsetString(endContainer, range.endOffset-1, 'start'));
        //         next = startContainer.getNext();
        //         counter = 0;
        //         while(next){
        //             console.log('next ', counter, ': ', next);
        //             counter++;
        //             next = next.getNext();
        //             if(next && next.equals(endContainer)){
        //                 console.log('end container is reached!');
        //                 break;
        //             }
        //         }

        //     }
        //     fakeDiv.append(ranges[0].cloneContents());
        //     selectionObj = fakeDiv.getHtml().inflate();
        //     linkContent = selectionObj.toText();

        //     len = selectionObj.length();
        //     if (len === 1) {
        //         elem = selectionObj.getFirst();
        //         if (elem instanceof Link){
        //             linkHref = elem.getHref();
        //         }
        //     }
        //     this.setValueOf('tab-general', 'text', linkContent);
        //     this.setValueOf('tab-general', 'href_input_field', Helper.dropProtocol(linkHref));
        //     this.getContentElement('tab-general', 'text').disable();
        // },
        // onShow: function() {
        //     selection = this.getParentEditor().getSelection();
        //     var ranges = selection.getRanges(),
        //         selectionContainer = [],
        //         startContainer,
        //         range,
        //         endContainer, startPath, endPath, startElem, endElem,
        //         startType,
        //         endType,
        //         fakeDiv = editor.document.createElement('div'),
        //         linkHref = '',
        //         selectionObj, linkContent, len, elem, i, rangesLen, next,
        //         iterationStop, isNodeInSelection;

        //     rangesLen = ranges.length;
        //     for (i = 0; i < rangesLen; i++){
        //         range = ranges[i];
        //         startContainer = range.startContainer;
        //         endContainer = range.endContainer;

        //         console.log('start container: ', startContainer, ', offset: ', range.startOffset);
        //         console.log('end container: ', endContainer, ', offset: ', range.endOffset);
        //         startPath = range.startPath();
        //         endPath = range.endPath();
        //         console.log('start path elements: ', startPath.elements, ', length: ', startPath.elements.length);
        //         console.log('end path elements: ', endPath.elements, ', length: ', endPath.elements.length);
        //         console.log('start path === end path?', startPath.compare(endPath));
        //         console.log('startContainer === endContainer?', startContainer.equals(endContainer));

        //         startType = startContainer.type;
        //         endType   = endContainer.type;
        //         startElem = startType === CKEDITOR.NODE_ELEMENT ? startContainer.getChild(range.startOffset) : startContainer;
        //         endElem = endType === CKEDITOR.NODE_ELEMENT ? endContainer.getChild(range.endOffset) : endContainer;
        //         console.log('startElem === endElem?', startElem.equals(endElem));
        //         iterationStop = startElem.equals(endElem);    // whether the start and end elements coincide
        //         if (startType === CKEDITOR.NODE_ELEMENT){
        //             selectionContainer.push(startContainer.getChild(range.startOffset));
        //         } else if (startType === CKEDITOR.NODE_TEXT) {
        //             if (iterationStop){
        //                 selectionContainer.push(new CKEDITOR.dom.text(startContainer.getText().substring(range.startOffset, range.endOffset)));
        //             } else{
        //                 selectionContainer.push(new CKEDITOR.dom.text(startContainer.getText().substring(range.startOffset)));
        //             }

        //         }
        //         next = startElem.getNext();
        //         while(!iterationStop && next){
        //             selectionContainer.push('next: ');
        //             selectionContainer.push(next);
        //             iterationStop = next.equals(endElem); // whether the node is the end container
        //             next = next.getNext();
        //         }
        //     }

        //     isNodeInSelection = selectionContainer.some(function(elem){
        //         return elem.type === CKEDITOR.NODE_ELEMENT;
        //     });

        //     console.log('selection container: ', selectionContainer);
        //     linkContent = CKHelper.arrayToText(selectionContainer, ' ');
        //     fakeDiv.append(ranges[0].cloneContents());
        //     selectionObj = fakeDiv.getHtml().inflate();
        //     // linkContent = selectionObj.toText();

        //     len = selectionObj.length();
        //     if (len === 1) {
        //         elem = selectionObj.getFirst();
        //         if (elem instanceof Link){
        //             linkHref = elem.getHref();
        //         }
        //     }
        //     this.setValueOf('tab-general', 'text', linkContent);
        //     this.setValueOf('tab-general', 'href_input_field', Helper.dropProtocol(linkHref));
        //     if (isNodeInSelection){
        //         // this.getContentElement('tab-general', 'text').disable();
        //     }
        // },

        // onShow: function() {
        //     selection = this.getParentEditor().getSelection();
        //     var ranges = selection.getRanges(),
        //         selectionContainer = [],
        //         startContainer,
        //         range,
        //         endContainer, startPath, endPath, startElem, endElem,
        //         startType,
        //         endType,
        //         fakeDiv = editor.document.createElement('div'),
        //         linkHref = '',
        //         selectionObj, linkContent, len, elem, i, rangesLen, next,
        //         iterationStop, isNodeInSelection;

        //     rangesLen = ranges.length;
        //     for (i = 0; i < rangesLen; i++){
        //         range = ranges[i];
        //         startContainer = range.startContainer;
        //         endContainer = range.endContainer;

        //         console.log('start container: ', startContainer, ', offset: ', range.startOffset);
        //         console.log('end container: ', endContainer, ', offset: ', range.endOffset);
        //         console.log('previous: ', endContainer.getPrevious());
        //         startPath = range.startPath();
        //         endPath = range.endPath();
        //         console.log('start path elements: ', startPath.elements, ', length: ', startPath.elements.length);
        //         console.log('end path elements: ', endPath.elements, ', length: ', endPath.elements.length);
        //         console.log('start path === end path?', startPath.compare(endPath));
        //         console.log('startContainer === endContainer?', startContainer.equals(endContainer));

        //         startType = startContainer.type;
        //         endType   = endContainer.type;
        //         startElem = startType === CKEDITOR.NODE_ELEMENT ? startContainer.getChild(range.startOffset) : startContainer;
        //         endElem = endType === CKEDITOR.NODE_ELEMENT ? endContainer.getChild(range.endOffset) : endContainer;
        //         console.log('startElem === endElem?', startElem.equals(endElem));
        //         iterationStop = startElem.equals(endElem);    // whether the start and end elements coincide
        //         if (startType === CKEDITOR.NODE_ELEMENT){
        //             selectionContainer.push(startContainer.getChild(range.startOffset));
        //         } else if (startType === CKEDITOR.NODE_TEXT) {
        //             if (iterationStop){
        //                 selectionContainer.push(new CKEDITOR.dom.text(startContainer.getText().substring(range.startOffset, range.endOffset)));
        //             } else{
        //                 selectionContainer.push(new CKEDITOR.dom.text(startContainer.getText().substring(range.startOffset)));
        //             }

        //         }
        //         next = startElem.getNext();
        //         while(!iterationStop && next){
        //             if (endType === CKEDITOR.NODE_TEXT){
        //                 console.log('end container is of TEXT type');
        //                 if(next.equals(endContainer)){
        //                     console.log('end container is equal to "next"');
        //                     console.info('exit', 'should exit');
        //                 }
        //             } else {
        //                 console.log('end container is NOT of TEXT type');
        //             }
        //             if (endType === CKEDITOR.NODE_ELEMENT){
        //                 console.log('end container is of ELEMENT type');
        //                 if(endContainer.contains(next)){
        //                     console.log('end container contains "next"');
        //                     console.info('exit', 'should exit');
        //                 }
        //             } else {
        //                 console.log('end container is NOT of ELEMENT type');
        //             }

        //             if (endType === CKEDITOR.NODE_ELEMENT){
        //                 if (endContainer.contains(next)){
        //                     console.info('iterations', 'end container contains "next"');
        //                 }
        //             }
        //             if (endType === CKEDITOR.NODE_TEXT){
        //                 if (next.contains(endContainer)){
        //                     console.info('iterations', '"next" contains end container');
        //                 }
        //             }


        //             selectionContainer.push('next: ');
        //             selectionContainer.push(next);
        //             iterationStop = next.equals(endElem); // whether the node is the end container
        //             next = next.getNext();
        //         }
        //     }

        //     isNodeInSelection = selectionContainer.some(function(elem){
        //         return elem.type === CKEDITOR.NODE_ELEMENT;
        //     });

        //     console.log('selection container: ', selectionContainer);
        //     linkContent = CKHelper.arrayToText(selectionContainer, ' ');
        //     fakeDiv.append(ranges[0].cloneContents());
        //     selectionObj = fakeDiv.getHtml().inflate();
        //     // linkContent = selectionObj.toText();

        //     len = selectionObj.length();
        //     if (len === 1) {
        //         elem = selectionObj.getFirst();
        //         if (elem instanceof Link){
        //             linkHref = elem.getHref();
        //         }
        //     }
        //     this.setValueOf('tab-general', 'text', linkContent);
        //     this.setValueOf('tab-general', 'href_input_field', Helper.dropProtocol(linkHref));
        //     if (isNodeInSelection){
        //         // this.getContentElement('tab-general', 'text').disable();
        //     }
        // },
        onShow: function() {
            CKEDITOR.document.getById(warningFieldId).setHtml('');
            selection = this.getParentEditor().getSelection();
            var ranges = selection.getRanges(),
                selectionContainer = [],
                startContainer, endContainer,
                startOffset, endOffset,
                range, piece,
                startPath, endPath, startElem, endElem,
                startType, endType,
                linkHref  = '',
                linkContent = '',
                i, rangesLen, next,
                isOut = false, isNodeInSelection;

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
                        piece = startContainer.split(startOffset).split(endOffset - startOffset);
                        startElem = piece.getPrevious();
                        selectionContainer.push('startElem: ');
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
                        selectionContainer.push('endElem: ');
                        selectionContainer.push(endElem);
                    }
                    if (endType === CKEDITOR.NODE_ELEMENT){
                        if (endOffset > 0){
                            endElem = endContainer.getChild(endOffset - 1);
                            selectionContainer.push('endElem: ');
                            selectionContainer.push(endElem);
                        } else {
                            endElem = endContainer.getParent();
                            console.log('getting parent: ', endElem);
                        }
                    }

                    if (startType === CKEDITOR.NODE_TEXT){
                        startElem = startContainer.split(startOffset);
                    }
                    if (startType === CKEDITOR.NODE_ELEMENT){
                        startElem = startContainer.getChild(startOffset);
                    }
                    selectionContainer.push('startElem: ');
                    selectionContainer.push(startElem);

                    // selectionContainer.push('endElem: ');
                    // selectionContainer.push(endElem);

                    next = startElem.getNext();
                    console.log('next: ', next);
                    isOut = !next || CKHelper.doesOverlap(next, endElem);
                    while (!isOut && next){
                        selectionContainer.push('next: ');
                        selectionContainer.push(next);
                        next = next.getNext();
                        isOut = !next || CKHelper.doesOverlap(next, endElem);
                    }
                }
            }

            isNodeInSelection = selectionContainer.some(function(elem){
                return elem.type === CKEDITOR.NODE_ELEMENT;
            });

            console.log('selection container: ', selectionContainer);
            linkContent = CKHelper.arrayToText(selectionContainer, ' ');
            // fakeDiv.append(ranges[0].cloneContents());
            // linkContent = selectionObj.toText();
            console.info('marker');
            if (selectionContainer.length === 1 && selectionContainer[0].type === CKEDITOR.NODE_ELEMENT && selectionContainer[0].getName === 'A') {
                linkHref = selectionContainer[0].getAttribute('href');
            }
            this.setValueOf('tab-general', 'text', linkContent);
            this.setValueOf('tab-general', 'href_input_field', Helper.dropProtocol(linkHref));
            if (isNodeInSelection){
                this.getContentElement('tab-general', 'text').disable();
            }
        },


        onCancel: function(){
            // clear the value of the warning field
            CKEDITOR.document.getById(warningFieldId).setHtml('');
        },

        onOk: function() {
            console.log('onOK: ', selection);
            console.log(this.getContentElement('tab-general', 'text').isEnabled());
            // clear the value of the warning field
            CKEDITOR.document.getById(warningFieldId).setHtml('');
            var node = this.getParentEditor().getSelection(),
                range = node.getRanges()[0],
                fakeDiv = editor.document.createElement('div'),
                linkElement, linkHref, linkStyle, linkContent, linkHrefRaw, linkContentRaw, isUnderlined;
            // user input
            linkHrefRaw = this.getValueOf('tab-general', 'href_input_field');
            linkContentRaw = this.getValueOf('tab-general', 'text');
            isUnderlined = this.getValueOf('tab-general', 'underlined');

            fakeDiv.append(range.cloneContents());
            selection = fakeDiv.getHtml().inflate();
            linkContent = selection.toText();

            console.log(selection);
            linkHref = 'http://' + encodeURI(Helper.dropProtocol(linkHrefRaw));

            // the range might contain nothing (to be a collapsed one)
            if (range.collapsed){
                linkContent = linkContentRaw;
            } else {
                // the range can start either with CKEDITOR.dom.Element or with CKEDITOR.dom.text
                switch (range.startContainer.type){
                    case CKEDITOR.NODE_ELEMENT:
                        linkContent = range.startContainer.getHtml();
                        break;
                    case CKEDITOR.NODE_TEXT:
                        linkContent = range.startContainer.getText();
                        break;
                    default:
                        linkContent = '';
                }

            }
            linkStyle = new LinkStyle();
            linkStyle['text-decoration'] = isUnderlined ? 'underline' : 'none';

            linkElement = editor.document.createElement('a');
            linkElement.setAttribute('href', linkHref);
            linkElement.setAttribute('style', linkStyle.toString());
            // linkElement.setHtml(linkContent);
            // editor.insertElement(linkElement);

        }
    };
});