/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global DOMParser, CKHelper, Helper, CKEDITOR */

/**
* Represents selected elements in the editor window. The argument `editor` is a
* [CKEditor editor](http://docs.ckeditor.com/#!/api/CKEDITOR.editor "see official site") instance and
* `selected` is a [CKEditor selection](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.selection "see official site") instance.
* @module    CKHelper
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
    * Instance of the editor containing the selection.  {{#crossLink "CKHelper/next-siblings:method"}}CKHelper['next-siblings']{{/crossLink}}
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
    */
    this.ranges = selected.getRanges();

    /**
    * Returns a 2-dim array of the form
    * <pre>
    * [[a<sub>00</sub>, a<sub>01</sub>, ...], [a<sub>10</sub>, a<sub>11</sub>, ...], ...].
    * </pre>
    * Each inner array corresponds
    * to the elements inside the {{#crossLink "Selection/ranges:property"}}ranges{{/crossLink}} property of the selection.
    * Since DOM is an ***ordered*** collection of the nodes, the the above mentioned array is just a collection of
    * simply-connected sets of nodes corresponding to the selection.<br>
    * NB1: _Simply-connected_ set is a set such that there exists a path inside the set connecting two arbitrary elements of the set.<br>
    * NB2: _Path_ consists of pieces connecting two neighbours (the set is ordered, so that the concept of "neighbour" exists).
    * @property {Array}  selectedNodes
    */
    this.selectedNodes = (function(ranges){
        var //ranges = this.ranges,
            startContainer, endContainer,
            startOffset, endOffset,
            range, startChild, endChild, nextChild,
            lastBlock = [], firstBlock = [], middleBlock = [],
            startElem, endElem,
            startType, endType,
            i, rangesLen, commonAnc,
            selectedNodes = [], // container for all selected nodes
            rangeNodes;         // container for selected nodes in current range
        // console.log('ranges: ', ranges);
        rangesLen = ranges.length;
        for (i = 0; i < rangesLen; i++){
            // console.info('loop', i);
            rangeNodes = [];
            range = ranges[i];
            if (!range.collapsed) {
                startContainer = range.startContainer;
                endContainer = range.endContainer;
                startType = startContainer.type;
                endType   = endContainer.type;
                startOffset = range.startOffset;
                endOffset = range.endOffset;
                startElem = null;
                endElem = null;
                lastBlock = [];
                firstBlock = [];
                middleBlock = [];
                // console.log('start container: ', startContainer, ', startType: ', startType, ', startOffset: ', startOffset);
                // console.log('end container: ', endContainer, ', endType: ', endType, ', endOffset: ', endOffset);

                if (startContainer.equals(endContainer)){
                    // console.log('start = end');
                    if (startType === CKEDITOR.NODE_TEXT){
                        startElem = startContainer.split(startOffset).split(endOffset - startOffset).getPrevious();
                        endElem = startElem;
                    } else if (startType === CKEDITOR.NODE_ELEMENT){
                        startElem = startContainer.getChild(startOffset);
                        // endElem = startContainer.getChild(endOffset) || startElem;
                        endElem = startElem;

                    }
                } else {
                    if (endType === CKEDITOR.NODE_TEXT){
                        endElem = endContainer.getLength() === endOffset ? endContainer : endContainer.split(endOffset).getPrevious();
                    } else if (endType === CKEDITOR.NODE_ELEMENT){
                        if (endOffset > 0){
                            endElem = endContainer.getChild(endOffset - 1);
                        } else {
                            endElem = endContainer.getParent();
                        }
                    }
                    if (startType === CKEDITOR.NODE_TEXT){
                        // Do not split the element if its length is equal to offset.
                        // In this case, take the next sibling of the element.
                        startElem = startContainer.getLength() === startOffset ? startContainer.getNext() : startContainer.split(startOffset);
                        // startElem =  startContainer.split(startOffset);
                    } else if (startType === CKEDITOR.NODE_ELEMENT){
                        startElem = startContainer.getChild(startOffset);
                    }

                }
                if (startElem === null || endElem === null){
                    // console.log('start elem or end elem is null: ', startElem, endElem);
                    break;
                }
                // console.log('start elem: ', startElem, ', end elem: ', endElem);
                if (CKHelper.containsOrEqual(startElem, endElem)){
                    rangeNodes = [startElem];
                } else if (CKHelper.containsOrEqual(endElem, startElem)) {
                    rangeNodes = [endElem];
                } else {
                    commonAnc = startElem.getCommonAncestor(endElem);
                    startChild = CKHelper.childWithNode(commonAnc, startElem);
                    endChild = CKHelper.childWithNode(commonAnc, endElem);

                    firstBlock = startElem.getParent().equals(commonAnc) ? [startElem] : CKHelper['bunch-next-siblings'](startElem, startChild);
                    // console.log('firstBlock: ', firstBlock);
                    rangeNodes = rangeNodes.concat(firstBlock);
                    // console.log('rangeNodes after adding first block: ', rangeNodes.length, ', ', rangeNodes);
                    nextChild = startChild.getNext();
                    while(nextChild && !nextChild.equals(endChild)){
                        // console.log('pushing nextChild: ', nextChild);
                        middleBlock.push(nextChild);
                        nextChild = nextChild.getNext();
                    }
                    // console.log('middleBlock: ', middleBlock);
                    rangeNodes = rangeNodes.concat(middleBlock);

                    lastBlock = endElem.getParent().equals(commonAnc) ? [endElem] : CKHelper['bunch-prev-siblings'](endElem, endChild);

                    // console.log('lastBlock: ', lastBlock);
                    rangeNodes = rangeNodes.concat(lastBlock.reverse());
                    // console.log('rangeNodes after adding end block: ', rangeNodes.length, ', ', rangeNodes);
                }

            }
            // console.log('rangeNodes that are to be pushed into selectedNodes: ', rangeNodes);
            selectedNodes.push(rangeNodes);
        }
        // selectedNodes.forEach(function(elem, ind){
        //     elem.forEach(function(elem2, ind2){
        //         console.log(ind, ind2, elem2);
        //     });
        // });
        return selectedNodes;
    }(this.ranges));

}