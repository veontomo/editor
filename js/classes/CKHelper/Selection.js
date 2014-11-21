/*jslint plusplus: true, white: true */
/*global DOMParser, CKHelper, CKEDITOR, Node, Dom, Range */

/**
* Represents selected elements in the editor window. The argument `ed` is a
* [CKEditor editor](http://docs.ckeditor.com/#!/api/CKEDITOR.editor "see official site")  instance.
* @module              CKHelper
* @class               Selection
* @param               {CKEDITOR.editor}         ed
*/
function Selection(ed) {
    "use strict";
    if (!(this instanceof Selection)) {
        return new Selection(ed);
    }

    if (ed !== undefined && !(ed instanceof CKEDITOR.editor)){
        throw new Error('The first argument must be a CKEDITOR.editor instance!');
    }

    /**
    * Editor instance containing the selection.
    * @property        {CKEDITOR.editor}         editor
    * @private
    */
    var editor = ed;

    /**
    * Selected elements.
    * @property        {CKEDITOR.dom.selection}  selected
    * @private
    */
    var selected;
    if (editor instanceof CKEDITOR.editor){
        selected = editor.getSelection();
    }

    /**
    * Array of [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) corresponding to the selection.
    *
    * Each element of the above array corresponds to a contiguous set of elements in the DOM.
    * @property        {Array}         _ranges
    * @private
    */
    var _ranges;
    if (selected instanceof CKEDITOR.dom.selection){
        _ranges = selected.getRanges();
    }

    /**
     * Current range number (for iterations over the ranges)
     * @property       {Integer}       _rangePointer
     * @since          0.0.8
     * @private
     */
    var _rangePointer;


    /**
     * The first node of the range.
     *
     * It is necessary to remember the first node because DOM changes (some nodes might be splitted).
     * @property {Node} _firstNodeOfRange
     * @private
     * @since 0.0.8
     */
    var _firstNodeOfRange;


    /**
     * The last node of the range.
     *
     * It is necessary to remember the last node because DOM changes (some nodes might be splitted).
     * @property       {Node}          _firstNodeOfRange
     * @private
     * @since          0.0.8
     */
    var _lastNodeOfRange;

    /**
     * {{#crossLink "Selection/_firstNodeOfRange:property"}}_firstNodeOfRange{{/crossLink}} getter.
     * @method         firstNodeOfRange
     * @since          0.0.8
     * @return         {Node}
     */
    this.firstNodeOfRange = function(){
        return _firstNodeOfRange;
    };

    /**
     * {{#crossLink "Selection/_lastNodeOfRange:property"}}_lastNodeOfRange{{/crossLink}} getter.
     * @method         lastNodeOfRange
     * @since          0.0.8
     * @return         {Node}
     */
    this.firstNodeOfRange = function(){
        return _firstNodeOfRange;
    };

    /**
     * {{#crossLink "Selection/_ranges:property"}}_ranges{{/crossLink}} getter.
     * @method         getRanges
     * @return         {Array}          array of [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instances
     */
    this.getRanges = function(){
        return _ranges;
    };

    /**
     * {{#crossLink "Selection/_ranges:property"}}_ranges{{/crossLink}} setter.
     * @method         setRanges
     * @param          {Array}      ranges
     * @return         void
     * @since          0.0.8
     */
    this.setRanges = function(ranges){
        if (!Array.isArray(ranges)){
            _ranges = [];
            return;
        }
        _ranges = ranges.filter(function(r){
            return this.isRange(r);
        }.bind(this));
    };


    /**
     * Appends a range to the selection if the argument is a Range instance and is not
     * already present in {{#crossLink "Selection/_ranges:property"}}_ranges{{/crossLink}} array.
     *
     * @method         appendRange
     * @param          {Range}         range
     * @return         {void}
     * @since          0.0.8
     */
    this.appendRange = function(range){
        if (this.isRange(range) && !this.containsRange(range)){
            var ranges = this.getRanges();
            if (Array.isArray(ranges)){
                ranges.push(range);
            } else {
                ranges = [range];
            }
            this.setRanges(ranges);
        }
    };

    /**
     * Whether the argument is a range.
     *
     * Returns `true` if the argument is a range, `false` otherwise.
     *
     * @method         isRange
     * @param          {Any}           r
     * @return         {Boolean}
     * @since          0.0.8
     */
    this.isRange = function(r){
        var isValid = (r instanceof Range);
        // console.log(r, isValid ? ' is a range' : ' is NOT a range!');
        return isValid;
    };

    /**
     * Whether the selection contains `range`.
     * @method         containsRange
     * @param          {Range}         range
     * @return         {Boolean}
     * @since          0.0.8
     */
    this.containsRange = function(range){
        if (!this.isRange(range)){
            throw Error('The argument must be a Range instance!');
        }
        var ranges = this.getRanges();
        if (ranges){
            // compares given argument range with range stored in varaible "range"
            var comparator = function(x){return this.areEqual(x, range);}.bind(this);
            return ranges.some(comparator);
        }
        return false;
    };

    /**
     * The number of elements in
     * {{#crossLink "Selection/_ranges:property"}}_ranges{{/crossLink}}
     * array.
     * @method         rangeCount
     * @return         {Integer}
     * @since          0.0.8
     */
    this.rangeCount = function(){
        var r = this.getRanges();
        if (!r){
            return 0;
        }
        return r.length;
    };

    /**
     * Whether two ranges `r1` and `r2` are equal.
     *
     * Returns `true` if `r1` and `r2` have equal starting and ending points. Otherwise, returns `false`.
     * @method         areEqual
     * @param          {Range}         r1       instance of Range
     * @param          {Range}         r2       instance of Range
     * @return         {Boolean}
     * @since          0.0.8
     */
    this.areEqual = function(r1, r2){
        if (!this.isRange(r1) || !this.isRange(r2)){
            return false;
        }
        var r1Start = r1.startContainer,
            r2Start = r2.startContainer,
            r1End = r1.endContainer,
            r2End = r2.endContainer;
        return r1Start && r2Start && r1End && r2End && r1Start.isEqualNode(r2Start) && r1End.isEqualNode(r2End) && r1.startOffset === r2.startOffset && r1.endOffset === r2.endOffset;
    };

    /**
     * Returns the next element from {{#crossLink "Selection/_ranges:property"}}_ranges{{/crossLink}}
     * if it exists.
     * @method         nextRange
     * @return         {Range|null}
     * @since          0.0.8
     */
    this.nextRange = function(){
        if (_rangePointer === undefined){
            _rangePointer = 0;
        }
        if (_rangePointer < this.rangeCount()){
            var r = this.getRanges()[_rangePointer];
            _rangePointer++;
            return r;
        }
    };

    /**
     * Restarts the range iterator.
     * @method         startOver
     * @return         {void}
     * @since          0.0.8
     */
    this.startOver = function(){
        if (_rangePointer !== undefined){
            _rangePointer = 0;
        }
    };




    /**
     * {{#crossLink "Selection/selected:property"}}selected{{/crossLink}} setter. Sets as well
     * {{#crossLink "Selection/_ranges:property"}}_ranges{{/crossLink}}.
     * @method         setSelected
     * @return         {void}
     */
    this.setSelected = function(obj){
        if (!(obj instanceof CKEDITOR.dom.selection)){
            throw new Error('The argument must be a CKEDITOR.dom.selection instance!');
        }
        selected = obj;
        _ranges = selected.getRanges();
    };

    /**
     * {{#crossLink "Selection/selected:property"}}selected{{/crossLink}} getter.
     * @method         getSelected
     * @return         {CKEDITOR.dom.selection}
     * @private
     */
    this.getSelected = function(){
        return selected;
    };


    /**
     * {{#crossLink "Selection/editor:property"}}editor{{/crossLink}} getter.
     * @method         getEditor
     * @return         {CKEDITOR.editor}
     */
    this.getEditor = function(){
        return editor;
    };

    /**
     * Converts range `r` into array of nodes which belong to the range.
     *
     * If `r` is not a valid [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instance,
     * then empty array is returned.
     *
     * @method         nodesOfRange
     * @since          0.0.8
     * @param          {Range}         r
     * @return         {Array}         array of [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instances
     */
    this.nodesOfRange = function(r){
        if (!(r instanceof Range)){
            return;
        }
        console.log('Range: ', r);
        if (r.collapsed){
            console.log('Range is collapsed');
            return [];
        }
        var startContainer = r.startContainer,
            endContainer = r.endContainer,
            commonParent = this.commonAncestor(startContainer, endContainer),
            startPath = this.pathTo(startContainer, commonParent),
            endPath = this.pathTo(endContainer, commonParent),
            startChild = commonParent.childNodes[startPath[0]],
            endChild = commonParent.childNodes[endPath[0]],
            startAfterNodes,
            endBeforeNodes,
            output = [];
        console.log('startPath: ', startPath);
        console.log('endPath: ', endPath);
        console.log('commonParent: ', commonParent);
        console.log('startChild: ', startChild);
        console.log('endChild: ', endChild);

        output.push(startContainer);
        startAfterNodes = this.bunchNextSiblings(startContainer, startChild);
        endBeforeNodes = this.bunchPrevSiblings(endContainer, endChild);
        if (startAfterNodes){
            output.concat(startAfterNodes);
        }
        if (endBeforeNodes){
            output.concat(endBeforeNodes);
        }
        if (!endContainer.isEqualNode(startContainer)){
            output.push(endContainer);
        }
        console.log(output);

        return output;
    };

    /**
     * Returns the first node of given range.
     *
     * If the start container is a [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text),
     * [Comment](https://developer.mozilla.org/en-US/docs/Web/API/Comment) or
     * [CDATASection](https://developer.mozilla.org/en-US/docs/Web/API/CDATASection) then DOM is modified
     * by replacing the node by two nodes: the first one is an out-of-range `r` part, the second - is an
     * inside-range `r` part. The second node is to be returned.
     *
     * In all other cases, a node specified by range `r`
     * [startOffset](https://developer.mozilla.org/en-US/docs/Web/API/Range.startOffset) is returned.

     * @method         startNode
     * @param          {Range}         r
     * @return         {Node}
     * @since          0.0.8
     */
    this.startNode = function(r){
        if (r.startContainer instanceof Element){
            return r.startContainer.childNodes[r.startOffset];
        }
        if (r.startContainer instanceof Text){
            var startOffset = r.startOffset;
            return this.splitTextNode(r.startContainer, startOffset);
        }
    };

    /**
     * Splits the text node in two text nodes: the first one contains first `pos` characters of the original node,
     * the second (newly appeared in the DOM) - the rest. The newly created node is then returned.
     * @method         splitTextNode
     * @param          {Text}          n
     * @param          {Integer}       pos
     * @return         {Text}
     * @since          0.0.8
     */
    this.splitTextNode = function(n, pos){
        if (n instanceof Text){
            var len = n.textContent.length;
            return n.splitText(((pos !== undefined) && (pos < len)) ? pos : len);
        }
    };



    /**
     * Gives common ancestor of nodes `n1` and `n2`. If it does not exist, `null` is returned.
     * @method         commonAncestor
     * @param          {DOM.Node}           n1     [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
     * @param          {DOM.Node}           n2     [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
     * @return         {DOM.Node|Null}
     * @since          0.0.8
     */
    this.commonAncestor = function(n1, n2){
        if (!((n1 instanceof Node) && (n2 instanceof Node))){
            // console.log('return undefined');
            return;
        }
        if (n1.contains(n2)){
            // console.log('return first argument', n1);
            return n1;
        }
        if (n2.contains(n1)){
            // console.log('return second argument', n2);
            return n2;
        }
        var parent = n1.parentNode;
        while (parent && !(parent.contains(n2))){
            // console.log('inside while loop: ', parent);
            parent = parent.parentNode;
        }
        // console.log('return parent', parent);
        return parent;
    };

    /**
     * Returns the longest common "head" of arrays `a1` and `a2`.
     *
     * Compares elements of the arrays from the beginning and if the elements are equal, insert it into the resulting array.
     * @method         commonHead
     * @param          {Array}         a1
     * @param          {Array}         a2
     * @return         {Array}
     */
    this.commonHead = function(p1, p2){
        var commonHeadAux = function(p1, p2, acc){
            if (p1.length === 0 || p2.length === 0 || p1[0] !== p2[0]){
                return acc;
            }
            acc.push(p1.shift());
            p2.shift();
            return commonHeadAux(p1, p2, acc);
        };
        if (Array.isArray(p1) && Array.isArray(p2)){
            return commonHeadAux(p1, p2, []);
        }
    };


    /**
     * Returns the root of `n`.
     *
     * A node is called to be a root of a node `n` if it contains node `n` and has no parent (that is the node highest ascendant).
     * @method         rootOf
     * @param          {Node}          n
     * @return         {Node|Null}
     */
    this.rootOf = function(n){
        if (!(n instanceof Node)){
            return undefined;
        }
        var node = n,
            parent = n.parentNode;
        while (parent){
            node = parent;
            parent = parent.parentNode;
        }
        return node;
    };

    /**
     * Returns array of integers corresponding to arc numbers that one should follow
     * in order to arrive from node `s` to node `n`. If node `s` is not set, then output of
     * {{#crossLink "Selection/rootOf:method"}}rootOf{{/crossLink}} is used.
     * @since          0.0.8
     * @method         pathTo
     * @param          {Node}          n     [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
     * @param          {Node|Null}     s     [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
     * @return         {Array|Null}
     */
    this.pathTo = function(n, s){
        if (!(n instanceof Node) || !((s instanceof Node) || (s === undefined) )){
            return;
        }
        var toTheTop = (s === undefined);
        var path = [];
        var parent = n;
        while (parent){
            if (!toTheTop && s.isEqualNode(parent)){
                return path;
            }
            path.push(this.indexOf(parent));
            parent = parent.parentNode;

        }
        if (toTheTop){
            return path;
        };
    }.bind(this);

    /**
     * Returns an element following `path` starting from element `ref`.
     *
     * If element is not found, nothing is returned.
     * @method         getNodeByPath
     * @param          {Array}         path         array of integers
     * @param          {Node}          ref
     * @return         {Node}
     * @since          0.0.8
     */
    this.getNodeByPath = function(path, ref){
        if (!(Array.isArray(path) && (ref instanceof Node))){
            return;
        }
        if (path.length === 0){
            return ref;
        }
        var newRef = ref.childNodes[path.shift()];
        if (newRef){
            return  this.getNodeByPath(path, newRef);
        }
    };

    /**
     * Returns index of node `n`.
     *
     * An index of a node is a number of the node in ordered list of its parent children. If the node has no parent, its
     * index is equal to zero.
     * @method         indexOf
     * @param          {Node}          n         [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
     * @return         {Integer}
     * @since          0.0.8
     */
    this.indexOf = function(n){
        if (!(n instanceof Node)){
            throw new Error('The argument must be a Node instance!');
        }
        var pos = 0,
            current = n.previousSibling;
        while (current){
            pos++;
            current = current.previousSibling;
        }
        return pos;
    };

    /**
     * Returns array of results of applying `operation` on each node when passing from `node` to `root`.
     *
     * @method         _bunchSibling
     * @private
     * @param          {Node}          node        [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
     * @param          {Node}          root        [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
     * @param          {Function}      operation   this single argument function is to be applied on each ascendant of
     *                                             `node` until `root` is reached.
     * @return         {Array}
     * @since          0.0.8
     */
    var _bunchSiblings = function(node, root, operation){
        var output = [],
            elem = node,
            siblings;
        while (!root.isEqualNode(elem)){
            siblings = operation(elem);
            output = output.concat(siblings);
            elem = elem.parentNode;
        }
        return output;
    };

    /**
     * Returns an array of [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instances that
     * come after `node` in the context of `root`.
     *
     * Therefore, all output array elements belong to `root` while niether
     * `root` nor `node` is included.
     * @method         bunchNextSiblings
     * @param          {Node}         node         a [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance,
     *                                             must be inside of `node`
     * @param          {Node}         root         a [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
     * @return         {Array}                     array of [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instances
     */
    this.bunchNextSiblings = function(node, root){
        if (!((node instanceof Node) && (root instanceof Node) && root.contains(node)) ){
            return;
        }
        return _bunchSiblings(node, root, this.nextSiblings);
    };

    /**
     * Returns an array of [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instances that
     * come before `node` in the context of `root`.
     *
     * Therefore, all output array elements belong to `root` while niether
     * `root` nor `node` is included.
     * @method         bunchPrevSiblings
     * @param          {Node}         node         a [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance,
     *                                             must be inside of `node`
     * @param          {Node}         root         a [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
     * @return         {Array}                     array of [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instances
     */
    this.bunchPrevSiblings = function(node, root){
        if (!((node instanceof Node) && (root instanceof Node) && root.contains(node)) ){
            return;
        }
        return _bunchSiblings(node, root, this.prevSiblings);
    };

    /**
     * Returns array of elememts that are obtained by always following direction `dir`.
     *
     * Starting from node `n`, the method applies property `dir` to it, until non-Node instance is
     * reached. Array of all intermediate elements are then returned.
     *
     * ** Attention to infinite loops! **
     * @method         _trackWalk
     * @private
     * @param          {Any}           elem
     * @param          {String}        prop       property name to be applied
     * @return         {Array}
     * @since          0.0.8
     *
     */
    var _trackWalk = function(elem, dir){
        var accum = [],
            node = elem[dir];
        while (node){
            accum.push(node);
            node = node[dir];
        }
        return accum;
    };


    /**
     * Returns an array of elements that are next siblings of the given one.
     *
     * The first next sibling becomes the first element of the array,
     * the second next sibling becomes the second one and so on.
     * @method         nextSiblings
     * @param          {Node}          [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
     * @return         {Array}         array of [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instances
     * @since          0.0.8
     */
    this.nextSiblings = function(elem){
        if (!(elem instanceof Node)){
            return undefined;
        }
        return _trackWalk(elem, 'nextSibling');
    };


    /**
     * Returns an array of Node instances that are siblings of the argument and that come before it.
     *
     * **Pay attention to the order:** the nearest previous sibling becomes the first element of the array,
     * the second previous sibling becomes the second one and so on.
     * @method         prevSiblings
     * @param          {Node}          [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
     * @return         {Array}         array of [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instances
     * @since          0.0.8
     */
    this.prevSiblings = function(elem){
        if (!(elem instanceof Node)){
            return undefined;
        }
        return _trackWalk(elem, 'previousSibling');
    };


    /**
     * Modifies DOM with respect to given range.
     *
     * If the range's start or end container is a [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text),
     * [Comment](https://developer.mozilla.org/en-US/docs/Web/API/Comment) or
     * [CDATASection](https://developer.mozilla.org/en-US/docs/Web/API/CDATASection) then DOM is modified
     * by cutting the container according to the range offsets.
     * @method         overlayRange
     * @param          {Range}         r
     * @return         {void}
     * @since          0.0.8
     */
    this.overlayRange = function(r){
        var _isText = function(n){
            return (n instanceof Text);
        };
        if (!(r instanceof Range)){
            throw new Error('The argument must be a Range instance!');
        }
        var sC = r.startContainer,
            eC = r.endContainer,
            sOff = r.startOffset,
            eOff = r.endOffset;
        if (_isText(sC) ){
            if (sC.isEqualNode(eC)){
                this.spliceText(sC, [sOff, eOff]);
            } else {
                this.spliceText(sC, [sOff]);
            }
        } else {
            if (_isText(eC)){
                this.spliceText(eC, [eOff]);
            }
        }
    };

    /**
     * <style>
     * .cut {color: red; font-weight: bold}
     * </style>
     * Splices text node in non-empty pieces, the cut points are given by array `breakpoints`.
     *
     * For example, if the text content of the node is <code>"this is a string"</code> and the breakpoints
     * array is <code>[3, 5, 6]</code>, then the cuts are done as follows:
     * <code>"thi<span class="cut">|</span>s <span class="cut">|</span>i<span class="cut">|</span>s a string"</code>
     * so that the original text node is splitted in four text nodes with the contents <code>"thi"</code>,
     * <code>"s "</code>, <code>"i"</code> and <code>"s a string"</code>.
     *
     * Cuts that correspond to the same point in the text node are replaced by the same one, i.e.
     * <code>[1, 3, 4, 4, 4, 7]</code> is equivalent to <code>[1, 3, 4, 7]</code>.
     *
     * The cuts that would result in producing empty text nodes, are ignored:
     * <code>"<span class="cut">|</span>a stri<span class="cut">|</span>ng<span class="cut">|</span>"</code> is equivalent
     * to <code>"a stri<span class="cut">|</span>ng"</code>.
     * @method         spliceText
     * @param          {Text}          t              [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text) instance
     * @param          {Array}         breakpoints    Array of integers in increasing order
     * @return         {void}
     */
    this.spliceText = function(t, bP){
        if (!(t instanceof Text)){
            throw new Error('The first argument must be a Text node instance!');
        }
        if (!Array.isArray(bP)){
            throw new Error('The second argument must be an array!');
        }
        var len = bP.length;
        if (len === 0){
            return;
        }
        var pointer = 0,
            prevPointer = 0,
            remnant = t,
            offset;

        while (pointer < len){
            offset = bP[pointer] - prevPointer;
            if (offset > 0 && offset < remnant.textContent.length){
                remnant = remnant.splitText(offset);
            }
            prevPointer = bP[pointer];
            pointer++;
        }
    };

    /**
     * {{#crossLink "Selection/editor:property"}}editor{{/crossLink}} setter. Sets as well
     * {{#crossLink "Selection/selected:property"}}selected{{/crossLink}} and
     * {{#crossLink "Selection/_ranges:property"}}_ranges{{/crossLink}}.
     * @method        setEditor
     * @param         {CKEDITOR.editor}     obj
     */
    this.setEditor = function(obj){
        if (!(obj instanceof CKEDITOR.editor)){
            throw new Error('The argument must be a CKEDITOR.editor instance!');
        }
        editor = obj;
        selected = obj.getSelection();
        _ranges = (selected instanceof CKEDITOR.dom.selection) ? selected.getRanges() : null;
    };

    /**
    * If selection is empty, returns empty array. Otherwise returns two dimensional array of the form
    * <pre>
    * [[a<sub>00</sub>, a<sub>01</sub>, ...], [a<sub>10</sub>, a<sub>11</sub>, ...], ...].
    * </pre>
    * Each inner array corresponds to the elements inside the
    * {{#crossLink "Selection/_ranges:property"}}_ranges{{/crossLink}} property of the selection.
    * Since DOM is an ***ordered*** collection of the nodes, the the above mentioned array is
    * just a collection of simply-connected sets of nodes corresponding to the selection.
    *
    * NB1: _Simply-connected_ set is a set such that there exists a path inside the set
    * connecting two arbitrary elements of the set.
    *
    * NB2: _Path_ consists of pieces connecting two neighbours (the set is ordered, so that
    * the concept of "neighbour" exists).
    * @method          selectedNodes
    * @param           {Selection}          sel
    * @private
    * @return          {Array}              two dimensional array of
    *                                       [CKEDITOR.dom.domObject](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.domObject)
    *                                       or empty array
    */
    var selectedNodes = function(sel){
        var startContainer, endContainer,
            startOffset, endOffset,
            rangesLocal = sel.getRanges(),
            range, startChild, endChild, nextChild,
            lastBlock = [],
            firstBlock = [],
            middleBlock = [],
            startElem, endElem,
            startType, endType,
            i, rangesLen, commonAnc,
            selNodes = [],      // container for all sel nodes
            rangeNodes;         // container for sel nodes in current range
        if (rangesLocal){
            rangesLen = rangesLocal.length;
            for (i = 0; i < rangesLen; i++){
                // console.info('loop', i);
                rangeNodes = [];
                range = rangesLocal[i];
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
                // console.log('rangeNodes that are to be pushed into selNodes: ', rangeNodes);
                selNodes.push(rangeNodes);
            }


        }
        // selNodes.forEach(function(elem, ind){
        //     elem.forEach(function(elem2, ind2){
        //         console.log(ind, ind2, elem2);
        //     });
        // });
        return selNodes;
    };

    /**
     * Two-dimensional array of nodes in selection.
     *
     * This property was created in order to assure that private method
     * {{#crossLink "Selection/selectedNodes:method"}}selectedNodes{{/crossLink}} gets called
     * just once because it seemingly modifies DOM in such
     * a way that if one calles it multiple times, a wrong array offset is requested, hence, an
     * error is generated.
     * @property       {Array}      nodes
     * @type           {Array}      array of [CKEDITOR.dom.domObject](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.domObject)
     */
    this.nodes = selectedNodes(this);

    /**
     * Returns text representation of the selected nodes. Remember that they are located inside a two-dimensional array.
     *
     * @method    toText
     * @param     {String}    blockSeparator          string to be used as a separator between arrays
     * @param     {String}    elemSeparator           string to be used as a separator between elements in array
     * @return    {String}
     */
    this.toText = function(blockSeparator, elemSeparator){
        var total = [];
        blockSeparator = blockSeparator || ' ';
        elemSeparator = elemSeparator || ' ';
        this.nodes.forEach(function(arr){
            var arrayNested = [];
            arr.forEach(function(el){
                if (el.type === CKEDITOR.NODE_TEXT || el.type === CKEDITOR.NODE_ELEMENT){
                    arrayNested.push(el.getText());
                }
            });
            total.push(arrayNested.join(elemSeparator));
        });
        return total.join(blockSeparator);
    };


    /**
     * Returns the start element of selection if it exists.
     * @method         getStartElement
     * @return         {CKEDITOR.dom.element}
     */
    this.getStartElement = function(){
        var sel = this.getSelected();
        if (sel instanceof CKEDITOR.dom.selection){
            return sel.getStartElement();
        }
    };

    /**
     * Returns `true` if {{#crossLink "Selection/selectedNodes:method"}}selectedNodes{{/crossLink}} is empty,
     * `false` otherwise.
     *
     * {{#crossLink "Selection/selectedNodes:method"}}selectedNodes{{/crossLink}} output is considered empty
     * if it is either empty array `[]` or an array containing empty array: `[[]]`.
     * @method         isEmpty
     * @return         {Boolean}
     */
    this.isEmpty = function(){
        var s = this.nodes;
        // console.log('selected nodes'  , s);
        //    empty array []  or containing empty array [[]]
        return s.length === 0 || (s.length === 1 && s[0].length === 0);
    };


    /**
     * Returns `true` if selected text starts inside a link, `false` otherwise.
     * In case when the selection is empty, cursor position is considered as beginning
     * of empty selection.
     * @method         startsInsideLink
     * @return         {Boolean}            whether the selection starts inside a link
     */
    this.startsInsideLink = function(){
        var start = this.getStartElement(),
            parentLink = null;
        if (start !== undefined && start !== null && (typeof start.getAscendant === 'function')){
            parentLink = start.getAscendant('a', true);
        }
        return parentLink !== null;
    };


    /**
     * Returns `true` if selection content is editable, `false` otherwise.
     *
     * Selection is editable if:
     * <ol>
     * <li>it is empty</li>
     * <li>it contains a single element that has type `text`</li>
     * <li>it contains a single element that is a link which child nodes are of type `text`</li>
     * </ol>
     * @method         isEditable
     * @return         {Boolean}
     */
    this.isEditable = function(){
        var nodes = this.nodes;
        if (!nodes){
            // console.log('nodes are not defined');
            return true;
        }
        var len = nodes.length;
        // exit point if the nodes array length differs form one
        if (len !== 1){
            // return true if it is empty and false if it is too long
            return len === 0;
        }

        // the first (and the only) block of the selection
        var firstBlock = nodes[0];
        len = firstBlock.length;
        // exit point if the firstblock is empty or has more than one element
        if (len !== 1){
            // return true if it is empty and false if it is too long
            return len === 0;
        }

        // the only element
        var elem = firstBlock[0];
        if (elem.type === CKEDITOR.NODE_TEXT){
            return true;
        }
        if (elem.type === CKEDITOR.NODE_ELEMENT){
            if (elem.getName() === 'a'){
                len = elem.getChildCount();
                if (len !== 1){
                    return len === 0;
                }
                return elem.getChild(0).type === CKEDITOR.NODE_TEXT;
            }
            return false;
        }
        return false;

    };

    /**
     * Removes duplicate DOM nodes form input array. Each element of the array must be an instance of
     * [CKEDITOR.dom.domObject](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.domObject).
     * @method         dropDuplicates
     * @private
     * @param          {Array}              $arr    one-dimensional array of
     *                                              [CKEDITOR.dom.domObject](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.domObject)
     *                                              objects
     * @return         {Array}                      array of distinct
     *                                              [CKEDITOR.dom.domObject](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.domObject)
     *                                              elements
     */
    var dropDuplicates = function(arr){
        var len = arr.length;
        if (len === 0 || len === 1){
            return arr;
        }
        if (len > 1){
            var first = arr[0],
                output = [],
                outputLen = 0,
                i, j,
                isPresent;
            output.push(first);
            outputLen++;

            for (i = 1; i < len; i++){
                isPresent = false;
                for (j = 0; j < outputLen; j++){
                    if (output[j].equals(arr[i])){
                        isPresent = true;
                        break;
                    }
                }
                if (!isPresent){
                    output.push(arr[i]);
                    outputLen++;
                }
            }
            return output;
        }
    };

    /**
     * Replaces each element in {{#crossLink "Selection/selected:property"}}selected{{/crossLink}} by
     * a link in which this element is located. In case the element is not located inside any link, then it
     * is leaved without changes. The output array mimics the structure of
     * {{#crossLink "Selection/selected:property"}}selected{{/crossLink}} array: it should be a two-dimensional array
     * without duplicates.
     * @method         absorbLink
     * @return         {void}
     */
    this.absorbLink = function(){
        var input = this.nodes,
            output = [],
            temp, link;
        if (this.isEmpty()){
            // if the selection is empty and the cursor is inside a link,
            // insert this link into nodes
            link = this.getStartElement().getAscendant('a', true);
            if (link){
                output.push([link]);   // resulting array must be 2-dimensional with a single element
            }
        } else {
            // parse elements in the selectionif it is not empty
            input.forEach(function(block){
                if (Array.isArray(block) && block.length > 0){
                    temp = [];
                    block.forEach(function(elem){
                        link = elem.getAscendant('a', true);
                        temp.push(link || elem) ;
                    });
                    output.push(dropDuplicates(temp));
                }
            });

        }
        this.nodes = output;
    };

    /**
     * Propagate style property named `prop` with the value `val` to the last descendant of each node in the selection.
     * Remember that the selection is in general a two-dimensional array (or one-dimensional if the selection is empty).
     *
     * Update: added possibility for `prop` to be an object (in this case the rest argument are ignored)
     * with the following keys: <ol><li>
     * `name` - name of the style property
     * </li><li>
     * `value` - on-value of the above property
     * </li><li>
     * `altVal` - off-value of the above property
     * </li></ol>
     *
     * @method         switchDeepestChildStyle
     * @param          {String|Object}        prop        name of the property to be imposed
     * @param          {String}               val         on-value of the above property
     * @param          {String}               altVal      off-value of the property
     * @since          0.0.4
     * @return         {void}
     */
    this.switchDeepestChildStyle = function(prop, val, altVal){
        var propName, value, altValue;
        if (typeof prop === 'object'){
            propName = prop.name;
            value = prop.value;
            altValue = prop.altValue;
        } else {
            propName = prop;
            value = val;
            altValue = altVal;
        }
        this.nodes.forEach(function(line){
            var dom = new Dom();
            if (line){
                line.forEach(function(node){
                    dom.nailStyleProperty(node.$, propName, value, altValue);
                });
            }
        });
    };


    /**
     * Returns first ancestor of {{#crossLink "Selection/nodes:property"}}nodes{{/crossLink}} for which `criteria` evaluates to
     * `true`.
     *
     * To function `criteria` there will be given one by one elements from {{#crossLink "Selection/nodes:property"}}nodes{{/crossLink}}
     * @method  findAcsendant
     * @param  {Function} criteria [description]
     * @return {CKEDITOR.dom.element}  [CKEDITOR.dom.element](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.element)
     */
    this.findAscendantOfBlock = function(criteria){
        if (this.isEmpty()){
            return;
        }
        var lenExt = this.nodes.length,
            lenInt, i, j, block, el;
        for (i = 0; i < lenExt; i++){
            block = this.nodes[i];
            lenInt = block.length;
            for (j = 0; j < lenInt; j++){
                el = block[j];
                if (criteria(el)){
                    return el;
                }
            }
        }
    };

}