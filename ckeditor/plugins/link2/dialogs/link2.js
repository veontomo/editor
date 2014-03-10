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
        onShow: function() {
            selection = this.getParentEditor().getSelection();
            var ranges = selection.getRanges(),
                range,
                startContainer, endContainer, endContainer_Str,
                startType,
                endType,
                fakeDiv = editor.document.createElement('div'),
                linkHref = '',
                selectionObj, linkContent, len, elem, i, j, rangesLen, next, counter, container = [],
                iterationStop, iterator, currentNode;

            rangesLen = ranges.length;
            console.log('onShow selection: ', selection);
            console.log('ranges length: ', rangesLen);
            for (i = 0; i < rangesLen; i++){
                iterationStop = false;
                range = ranges[i];
                console.log('loop over ranges: #', i+1, ' of total ', rangesLen);

                startContainer = range.startContainer;
                endContainer = range.endContainer;
                endContainer_Str = CKHelper.nodeString(endContainer);
                startPath = range.startPath();
                endPath = range.endPath();
                // console.log('start path', startPath);
                // console.log('end path', endPath);
                console.log('start === end? ', endPath.compare(startPath));

                startType = startContainer.type;
                endType = endContainer.type;

                console.log('start');
                if (startType === CKEDITOR.NODE_ELEMENT){
                    container.push('start');
                    container.push(startContainer.getChild(range.startOffset));

                }
                if(startContainer.equals(endContainer)){
                    console.log('end container equals to start container!');
                    iterationStop = true;
                }
                if(endContainer_Str !== CKHelper.nodeString(endContainer)){console.log('WTF');} else {console.log('OK');}

                next = startContainer.getNext();
                counter = 0;
                while(!iterationStop && next){
                    // console.log('next ', counter, ': ', next);
                    counter++;
                    if (next.type === CKEDITOR.NODE_ELEMENT){
                        container.push('next' + counter);
                        container.push(next);
                    }
                    if(next.equals(endContainer)){
                        console.log('end container is reached!');
                        iterationStop = true;
                        break;
                    }
                    next = next.getNext();
                }

                if(endContainer_Str !== CKHelper.nodeString(endContainer)){console.log('WTF');} else {console.log('OK');}
                // if (!iterationStop){
                //     counter = 0;
                //     console.log('middle iterations');
                //     if(endContainer_Str !== CKHelper.nodeString(endContainer)){console.log('WTF');} else {console.log('OK');}
                //     iterator = range.createIterator();
                //     iterator.enforceRealBlocks = false;
                //     iterator.getNextParagraph();                              // the start container itself
                //     currentNode = iterator.getNextParagraph();                // node next to the start
                //     if(endContainer_Str !== CKHelper.nodeString(endContainer)){
                //         console.log('WTF!?!?!');
                //         console.log('initial: ', endContainer_Str);
                //         console.log('after: ', CKHelper.nodeString(endContainer));
                //     } else {
                //         console.log('OK');
                //     }
                //     while (currentNode){
                //         console.log('middle loop ' + counter);
                //         if(endContainer_Str !== CKHelper.nodeString(endContainer)){console.log('WTF');} else {console.log('OK');}
                //         if (currentNode.type === CKEDITOR.NODE_ELEMENT){
                //             container.push('middle' + counter);
                //             container.push(currentNode);
                //         }
                //         if (currentNode.equals(endContainer)){
                //             console.log('end container is found among iterators!');
                //             iterationStop = true;
                //             break;
                //         }
                //         currentNode = iterator.getNextParagraph();
                //     }
                // }
                // if(!startContainer.equals(startContainer_copy)){ console.log('WTF!?');}
                // if(!endContainer.equals(endContainer_copy)){ console.log('WTF!?');}
                if(endContainer_Str !== CKHelper.nodeString(endContainer)){console.log('WTF');} else {console.log('OK');}
                if (!iterationStop){
                    console.log('end container iterations');
                    if (endType === CKEDITOR.NODE_ELEMENT){

                        console.log('* end container: (', endType, ') ', endContainer, ', end offset: ', range.endOffset, ', string: ', CKHelper.nodeOffsetString(endContainer, range.endOffset-1, 'start'));

                        // for (j = 0; j < range.endOffset; j++){
                            // if (endContainer.getChildren().getItem(range.endOffset - 1).type === CKEDITOR.NODE_ELEMENT){
                                // container.push('end ' );
                                // container.push(endContainer.getChild(j));
                            // }

                        // }
                    }
                }
            }
            console.log(container);
            fakeDiv.append(ranges[0].cloneContents());
            selectionObj = fakeDiv.getHtml().inflate();
            linkContent = selectionObj.toText();

            len = selectionObj.length();
            if (len === 1) {
                elem = selectionObj.getFirst();
                if (elem instanceof Link){
                    linkHref = elem.getHref();
                }
            }
            this.setValueOf('tab-general', 'text', linkContent);
            this.setValueOf('tab-general', 'href_input_field', Helper.dropProtocol(linkHref));
            this.getContentElement('tab-general', 'text').disable();

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