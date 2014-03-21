/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global DOMParser, CKHelper, Helper, CKEDITOR */

/**
* Represents selected elements in the editor window. The argument `editor` is a
* [CKEditor editor](http://docs.ckeditor.com/#!/api/CKEDITOR.editor "see official site") instance and
* `selected` is a [CKEditor selection](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.selection "see official site") instance.
* @module    Helper
* @class     Selection
* @param     {CKEDITOR.editor}         editor
* @param     {CKEDITOR.dom.selection}  selected
*/
function Selection(editor, selected) {
    "use strict";
    if (!(this instanceof Selection)) {
        return new Selection(editor, selected);
    }
    if (!CKHelper.isEditor(editor)){
        throw new Error('The first argument must be a CKEDITOR.editor instance!');
    }
    if (!CKHelper.isSelection(selected)){
        throw new Error('The second argument must be a CKEDITOR.dom.selection instance!');
    }

    /**
    * Instance of the editor containing the selection.
    * @property {CKEDITOR.editor}         editor
    */
    this.editor = editor;


    /**
    * Selected elements.
    * @property {CKEDITOR.dom.selection}  selected
    */
    this.selected = selected;

    /**
    * Array of range instances corresponding to the selection.
    * Alias for [selection.getRanges()](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.selection-method-getRanges).
    * @property {Array}   ranges
    * @type     {Array}
    */
    this.ranges = selected.getRanges();

    /**
    * Returns an array of the form [[elem00, elem01, ...], [elem10, ele11, ...], ...]. Each element of the array corresponds
    * to the elements inside the {{#crossLink "Selection/ranges:property"}}ranges{{#crossLink}} property of the selection.
    * In other words, each element of {{#crossLink "Selection/getNodes:method"}}getNodes(){{/crossLink}}
    * reflects the structure of {{#crossLink "Selection/ranges:property"}}ranges{{/crossLink}} that is an array of
    * [CKEDITOR.dom.range](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.range) instances.
    * @method getNodes
    * @return {Array}   array of arrays of nodes in the selection. The inner array corresponds to the simply-connected
    *                   DOM nodes in the selection.
    */
    this.getNodes = function(){
        var ranges = this.ranges,
            startContainer, endContainer,
            startOffset, endOffset,
            startPath, endPath,
            range,
            startElem, endElem,
            startType, endType,
            i, rangesLen, next, path, commonAnc,
            isOut = false,
            doesOverlap,
            selectedNodes = [], // container for all selected nodes
            rangeNodes;         // container for selected nodes in current range
        console.log('ranges: ', ranges);
        rangesLen = ranges.length;
        for (i = 0; i < rangesLen; i++){
            console.info('loop', i);
            rangeNodes = [];
            range = ranges[i];
            if (!range.collapsed) {
                startContainer = range.startContainer;
                endContainer = range.endContainer;
                startType = startContainer.type;
                endType   = endContainer.type;
                startPath = new CKEDITOR.dom.elementPath(startContainer);
                endPath = new CKEDITOR.dom.elementPath(endContainer);
                startOffset = range.startOffset;
                endOffset = range.endOffset;
                commonAnc = startContainer.getCommonAncestor(endContainer);
                console.log('startPath === endPath?', startPath.compare(endPath));
                console.log('common ancestor: ', commonAnc);
                console.log('start container path: ', new CKEDITOR.dom.elementPath(startContainer, commonAnc));
                console.log('end container position wrt start : ', startContainer.getPosition(endContainer));
                console.log('end container path: ', new CKEDITOR.dom.elementPath(endContainer, commonAnc));

                if (endType === CKEDITOR.NODE_TEXT){
                    endElem = endContainer.split(endOffset).getPrevious();
                }
                if (endType === CKEDITOR.NODE_ELEMENT){
                    if (endOffset > 0){
                        endElem = endContainer.getChild(endOffset - 1);
                    } else {
                        endElem = endContainer.getParent();
                    }
                }
                if (startType === CKEDITOR.NODE_TEXT){
                    startElem = startContainer.split(startOffset).split(endOffset - startOffset).getPrevious();
                }
                if (startType === CKEDITOR.NODE_ELEMENT){
                    startElem = startContainer.getChild(startOffset);
                }
                console.info('new', startElem, endElem);






                if (startContainer.equals(endContainer)){
                    // the selection starts and finishes in the same container
                    if (startType === CKEDITOR.NODE_TEXT){
                        startElem = startContainer.split(startOffset).split(endOffset - startOffset).getPrevious();
                        rangeNodes.push(startElem);
                    }
                    if (startType === CKEDITOR.NODE_ELEMENT){
                        rangeNodes.push(startContainer.getChild(startOffset));
                    }
                } else {
                    // the selection starts in one container and finishes in another.
                    // First, process the end element because usage of "split" method
                    // might change DOM so that startOffset and endOffset might not
                    // correspond to the modified positions of elements in DOM.
                    if (endType === CKEDITOR.NODE_TEXT){
                        endElem = endContainer.split(endOffset).getPrevious();
                        Helper.pushBeforeLast(rangeNodes, endElem);
                    }
                    if (endType === CKEDITOR.NODE_ELEMENT){
                        if (endOffset > 0){
                            endElem = endContainer.getChild(endOffset - 1);
                            Helper.pushBeforeLast(rangeNodes, endElem);
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
                    Helper.pushBeforeLast(rangeNodes, startElem);
                    path =  new CKEDITOR.dom.elementPath(startElem);
                    console.log('path: ', path);
                    // console.log('isContextFor: ', path.isContextFor('p'));

                    next = startElem.getNext();
                    doesOverlap = CKHelper.doesOverlap(next, endElem);
                    isOut = !next || doesOverlap;
                    console.info('before entering the while loop', 'next: ', next, ', doesOverlap: ', doesOverlap,  ', isOut = ', isOut, 'rangeNodes = ', rangeNodes);
                    while (!isOut && next){
                        console.info('while loop', 'next: ', next);
                        if (next.type === CKEDITOR.NODE_ELEMENT){
                            console.info('tab index: ', next.getTabIndex());
                        }
                        Helper.pushBeforeLast(rangeNodes, next);
                        next = next.getNext();
                        isOut = !next || CKHelper.doesOverlap(next, endElem);
                        console.info('status in while loop', 'next: ', next, ', doesOverlap: ', doesOverlap, ', isOut = ', isOut, 'rangeNodes = ', rangeNodes);
                    }
                    // console.log('test: ', startContainer.getParent().getNext());
                }
            }
            selectedNodes.push(rangeNodes);
        }
        return selectedNodes;
    };
}