/*jslint plusplus: true, white: true */
/*global DOMParser, CKHelper, CKEDITOR, Node, Styles */

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
    * Array of [range instances](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.range) corresponding to the selection.
    * @property {Array}   ranges
    * @private
    */
    var ranges;
    if (selected instanceof CKEDITOR.dom.selection){
        ranges = selected.getRanges();
    }

    /**
     * {{#crossLink "Selection/ranges:property"}}ranges{{/crossLink}} getter.
     * @method         getRanges
     * @return         {Array}          array of CKEDITOR.dom.range instances
     */
    this.getRanges = function(){
        return ranges;
    };

    /**
     * {{#crossLink "Selection/selected:property"}}selected{{/crossLink}} setter. Sets as well
     * {{#crossLink "Selection/ranges:property"}}ranges{{/crossLink}}.
     * @method         setSelected
     * @return         {void}
     */
    this.setSelected = function(obj){
        if (!(obj instanceof CKEDITOR.dom.selection)){
            throw new Error('The argument must be a CKEDITOR.dom.selection instance!');
        }
        selected = obj;
        ranges = selected.getRanges();
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
     * {{#crossLink "Selection/editor:property"}}editor{{/crossLink}} setter. Sets as well
     * {{#crossLink "Selection/selected:property"}}selected{{/crossLink}} and
     * {{#crossLink "Selection/ranges:property"}}ranges{{/crossLink}}.
     * @method        setEditor
     * @param         {CKEDITOR.editor}     obj
     */
    this.setEditor = function(obj){
        if (!(obj instanceof CKEDITOR.editor)){
            throw new Error('The argument must be a CKEDITOR.editor instance!');
        }
        editor = obj;
        selected = obj.getSelection();
        ranges = (selected instanceof CKEDITOR.dom.selection) ? selected.getRanges() : null;
    };

    /**
    * If selection is empty, returns empty array. Otherwise returns two dimensional array of the form
    * <pre>
    * [[a<sub>00</sub>, a<sub>01</sub>, ...], [a<sub>10</sub>, a<sub>11</sub>, ...], ...].
    * </pre>
    * Each inner array corresponds to the elements inside the
    * {{#crossLink "Selection/ranges:property"}}ranges{{/crossLink}} property of the selection.
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
     * Returns value of style property `prop` of node `n`. It looks up the chain of parents until finds
     * first occurence of key `prop`. If the key is not present in any of ancestors, nothing is returned.
     * @method          _lookUpInParents
     * @param          {DOM.Node}           n         [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
     * @param          {String}             prop      name of the property to look for
     * @return         {String|void}
     * @private
     * @since          0.0.4
     */
    var _lookUpInParents = function(n, prop){
        console.log('inside _lookUpInParents');
        var currentNode = n,
            stl;
        while (currentNode){
            console.log('current Node: ', currentNode);
            if (typeof currentNode.getAttribute === 'function'){
                stl = new Styles(currentNode.getAttribute('style'));
                if (stl.hasProperty(prop)){
                    return stl.getProperty(prop);
                }
            }
            currentNode = currentNode.parentNode;
        }
    };

    /**
     * Toggles inline style property `prop` of node `n`. When it turns out that the property should
     * be set, it is set to value `val`.
     *
     * @method          _toggleNodeStyle
     * @private
     * @param          {DOM.Node}           n          instance of [DOM.Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)
     * @param          {String}             prop       style property name to be toggled
     * @param          {String}             val        on-value of the the style property
     * @param          {String|Null}        altVal     off-value of the style property
     * @return         {void}
     * @since          0.0.4
     */
    var _toggleNodeStyle = function(n, prop, val, altVal){
        var attrName = 'style',
            stl, stlStr;
        if (!(typeof n === 'object' && n.nodeType)){
            return;
        }
        console.log('from parents: ', _lookUpInParents(n, prop));
        stl = new Styles(n.getAttribute(attrName));
        stl.toggleProperty(prop, val, altVal);
        stlStr = stl.toBareString();
        if (stlStr){
            n.setAttribute(attrName, stlStr);
        } else {
            n.removeAttribute(attrName);
        }
    };


    /**
     * Returns **proxy** node of `n`:
     * <ol><li>
     * if `n` is a text element without siblings, then proxy of `n` is its parent node,
     * </li><li>
     * if `n` is a text element with siblings or is a node element, then proxy of `n` is `n` itself.
     * </li></ol>
     * @method         _proxy
     * @param          {DOM.Node}          n          [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
     * @return         {DOM.Node|Null}
     */
    this.proxy = function(n){
        if (n === undefined || n.nodeType === undefined){
            return null;
        }
        if (n.nodeType === Node.ELEMENT_NODE){
            return n;
        }
        return (n.nextSibling || n.previousSibling) ? n : n.parentNode;
    };

    /**
     * Gets value of style property `key` of nearest ascendant up to `limitNode`
     * that has that property set.
     * If the property is not found, null is returned.
     * @param          {String}             key       name of property to find among inline style of ascendants
     * @return         {String|Number|Null}
     */
    this.getInheritedStyleProp = function(key, limitNode){
        /// !!! stub
        return null;
    }


    /**
     * Modifies inline style properties of a {{#crossLink "Selection/_proxy:method"}}proxy{{/crossLink}}
     * node of deepest children of node `n` in the following way:
     * <ol><li>
     * if style property `prop` of the deepest child is equal to `val`, then inline
     * style property of its "proxy" node is set to be `altVal`.
     * </li><li>
     * if style property `prop` of the deepest child is not equal to `val`, then inline
     * style property of its "proxy" node is set to be `val`.
     * </li></ol>
     * @private
     * @method         _deferToggleStyle
     * @param          {Node}               n                  [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
     * @param          {String}             prop               name of style property (i.e., "width" or "text-decoration")
     * @param          {String}             val                value of style property (i.e., "10px" or "underline")
     * @return         {void}
     * @since          0.0.4
     * @todo           Try to make this method shorter
     */
    var _deferToggleStyle = function(n, prop, val, altVal){
        var childNodes = n.childNodes,
            childNum = childNodes.length,
            child, span, parent, counter;
        switch (childNum){
             // node has no children
            case 0:
                if (n.nodeType === Node.ELEMENT_NODE){
                    _toggleNodeStyle(n, prop, val, altVal);
                    break;
                }
                if (n.nodeType === Node.TEXT_NODE){
                    console.log('from parents: ', _lookUpInParents(n, prop));
                    span = new Tag();
                    span.setTag('span');
                    span.setStyleProperty(prop, val);
                    span.setContent(n.nodeValue);
                    parent = n.parentNode;
                    if (parent){
                        parent.replaceChild(span.toNode(), n);
                    }
                    break;
                }
                break;
            // node has only one child
            case 1:
                child = n.firstChild;
                if (child.nodeType === Node.TEXT_NODE){
                     _toggleNodeStyle(n, prop, val, altVal);
                } else {
                    _deferToggleStyle(child, prop, val, altVal);
                }
                break;
            // node has many children
            default:
                console.log("children no. : ", childNum, childNodes);
                for (counter = 0; counter < childNum; counter++){
                    _deferToggleStyle(childNodes[counter], prop, val, altVal);
                }
        }
    };


    /**
     * Propagate style property named `prop` with the value `val` to the last descendant of each node in the selection.
     * Remember that the selection is in general a two-dimensional array (or one-dimensional if the selection is empty).
     * @method         switchDeepestChildStyle
     * @param          String               prop        name of the property to be imposed
     * @param          String               val         on-value of the above property
     * @param          String               altVal      off-value of the property
     * @since          0.0.4
     * @return         void
     */
    this.switchDeepestChildStyle = function(prop, val, altVal){
        console.log("text content of selection at start: " + this.toText('|', ' ***'));
        var that = this;
        this.nodes.forEach(function(line){
            if (line){
                line.forEach(function(node){
                    _deferToggleStyle(node.$, prop, val, altVal);
                });
            // seems to be useless
            that.normalizeParentOf(line);
            }
        });
        console.log("text content of selection at the end: " + this.toText('|', ' ***'));

    };

    /**
     * Gives common ancestor of nodes n1 and n2. If it does not exist, `null` is returned.
     * @method         _commonAncestor
     * @private
     * @param          {DOM.Node}           n1     [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
     * @param          {DOM.Node}           n2     [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
     * @return         {DOM.Node|Null}
     * @since          0.0.4
     */
    var _commonAncestor = function(n1, n2){
        console.log(n1, n2);
        if (n1 === undefined || n2 === undefined){
            console.log('return undefined');
            return;
        }
        if (n1.contains(n2)){
            console.log('return first argument', n1);
            return n1;
        }
        if (n2.contains(n1)){
            console.log('return second argument', n2);
            return n2;
        }
        var parent = n1.parentNode;
        while (parent && !(parent.contains(n2))){
            console.log('inside while loop: ', parent);
            parent = parent.parentNode;
        }
        console.log('return parent', parent);
        return parent;
    };

    /**
     * Gives common ancestor of nodes n1 and n2. If it does not exist, `null` is returned.
     * @method         commonAncestor
     * @param          {DOM.Node}           n1     [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
     * @param          {DOM.Node}           n2     [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
     * @return         {DOM.Node|Null}
     */
    this.commonAncestor = function(n1, n2){
        return _commonAncestor(n1, n2);
    };

    /**
     * Returns common ancestor of all array elements. If an element is not a
     * [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance, it is ignored.
     * @method         commonAncestor
     * @return         {DOM.Node|Null}      common ancestor of the arguments
     */
    this.commonAncestorSoft = function(elems){
        if (!Array.isArray(elems)){
            return null;
        }
        var arg = elems.filter(function(el){
            return el && el.nodeType !== undefined;
        });
        if (arg.length === 0){
            return null;
        }
        var el = arg.shift(),
            elTmp;
        while (arg.length > 0){
            elTmp = arg.shift();
            el = _commonAncestor(el, elTmp);
        }
        return el;
    };

    /**
     * Normalize parent of elements of the array.
     * @param  {Array}     elems
     * @return {void}
     */
    this.normalizeParentOf = function(elems){
        var el = this.commonAncestorSoft(elems);
        if (el){
            el.normalize();
        }
    };



}