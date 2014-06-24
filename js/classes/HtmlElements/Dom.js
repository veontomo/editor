/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global Node, Dom, Styles, Tag */

/**
 * This class is sort of helper to deal with DOM elements.
 * @module 	    HtmlElements
 * @class  		Dom
 * @constructor
 * @since       0.0.4
 * @author      A.Shcherbakov
 */

function Dom(){
	/**
	 * Returns value of style property `prop` of node `n`. It looks up the chain of parents until finds
	 * first occurence of key `prop`. If the key is not present in any of ancestors, nothing is returned.
	 * @method          _lookUpInParents
	 * @param          {DOM.Node}           n         [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @param          {String}             prop      name of the property to look for
	 * @return         {String|void}
	 * @private
	 * @deprecated     in favour of {{#crossLink "Dom/getInheritedStyleProp:method"}}getInheritedStyleProp{{/crossLink}}
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
	 * Looks for a value of style property `key` of nearest ascendant of `node` in the scope of node `scope`.
	 * If the property is found, its value is returned, otherwise,  `undefined` is returned.
	 *
	 * Limit node `scope` is supposed to contain `node`. Otherwise, the search for the property
	 * is performed up to the "highest" parent of `node`.
	 *
	 * NB: ** optimize algorithm in such a way that DOM is parsed only once even when `scope` is set wrong. **
	 * @method         getInheritedStyleProp
	 * @param          {DOM.Node}           node      [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @param          {DOM.Node}           scope     [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @param          {String}             key       name of property to find among inline style of ascendants
	 * @return         {String|Number|Null}
	 * @since          0.0.4
	 */
	this.getInheritedStyleProp = function(key, node, scope){
		if (node === undefined){
			throw new Error("Starting node must be defined!");
		}
		var root, parent, stl,
			currentNode = node;
		root = scope;
		// if the scope is not defined or if it is erraneous, impose scope to be the root.
		if (root === undefined || !root.contains(node)){
			root = node;
			parent = root.parentNode;
			while (parent){
				root = parent;
				parent = root.parentNode;
			}
		}
		while (root.contains(currentNode)){
			// a node might have no "getAttribute" method (as text node does)
			if (typeof currentNode.getAttribute === 'function'){
				stl = new Styles(currentNode.getAttribute('style'));
				if (stl.hasProperty(key)){
					return stl.getProperty(key);
				}
			}
			currentNode = currentNode.parentNode;
		}
	};


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
	    // console.log(n1, n2);
	    if (n1 === undefined || n2 === undefined){
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
	 * @method         commonAncestorSoft
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
	 * @method  normalizeParentOf
	 * @param  {Array}     elems
	 * @return {void}
	 */
	this.normalizeParentOf = function(elems){
	    var el = this.commonAncestorSoft(elems);
	    if (el){
	        el.normalize();
	    }
	};


	/**
	 * Toggles style property `key` of element `elem` from `primary` to `secondary`.
	 * If the element has style property `key` equal to `primary`, then it is imposed to `secondary`.
	 * Otherwise, it is imposed to `primary`.
	 *
	 * An element is considered to have style property imposed if either the element itself, or any of
	 * its parents has that value imposed.
	 *
	 * If not [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) instance is given as the first
	 * argument, then the method performs nothing. Note, that for text nodes this method is not applicable,
	 * since text nodes have no attributes.
	 * @method         toggleElementStyle
	 * @param          {DOM.Element}        elem       [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) instance
	 * @param          {String}             key        name of style property to change
	 * @param          {String|Number}      primary    primary value of the above style property
	 * @param          {String|Number}      secondary  secondary value of the style property
	 * @return         {void}
	 * @since          0.0.4
	 */
	this.toggleElementStyle = function(elem, key, primary, secondary){
		if (elem && elem.nodeType === Node.ELEMENT_NODE){
			var attrName = 'style',
				stl = new Styles(elem.getAttribute(attrName)),
				styleValue = this.getInheritedStyleProp(key, elem);
			stl.setProperty(key, (styleValue === primary) ? secondary :  primary);
			elem.setAttribute(attrName, stl.toBareString());
		}
	};

	/**
	 * Returns an [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) instance with the style
	 * property `key` equal to `secondary` if value of `key` attribute in "style" property  is equal to `primary`. Otherwise,
	 * `key` value will be imposed to `primary`.
	 *
	 * Created instance is a "span" html tag.
	 * @method         createToggledElemFromText
	 * @param          {DOM.Text}           textNode        [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text)
	 *                                                      instance whose "toggle" copy is to be created
	 * @param          {String}             key             name of style property (i.e., text-decoration", "font-style")
	 * @param          {String|Number}      primary         primary value of the style property
	 * @param          {String|Number}      secondary       secondary value
	 * @return         {DOM.Node}
	 * @since          0.0.4
	 */
	this.createToggledElemFromText = function(textNode, key, primary, secondary){
		if (textNode && textNode.nodeType === Node.TEXT_NODE){
			var output = document.createElement('span'),
				textNodeCopy = document.createTextNode(textNode.nodeValue);
				styleValue = this.getInheritedStyleProp(key, textNode),
				styleToggled = styleValue === primary ? secondary : primary;
			output.setAttribute('style', key + ': ' + styleToggled + ';');
			output.appendChild(textNodeCopy);
			return output;
		}
	};

}

