/*jslint plusplus: true, white: true */
/*global Node, Dom, Properties, Tag, Helper */

/**
 * This class deals with the elements of the editor document. Its functionality is similar
 * to those of {{#crossLink "Document"}}Document{{/crossLink}}.
 *
 * The difference between them: {{#crossLink "Document"}}Document{{/crossLink}} is a singleton,
 * while {{#crossLink "Dom"}}Dom{{/crossLink}} is a class that accepts creation of multiple
 * instances.
 * @module 	    Document
 * @class  		Dom
 * @constructor
 * @since       0.0.4
 * @author      A.Shcherbakov
 */

function Dom(){

	/**
	 * [DOM.Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance representing content of the
	 * editor.
	 * @property {DOM.Node}    _content
	 * @private
	 * @since    0.0.8
	 */
	var _content;

	/**
	 * {{#crossLink "Dom/_editor:property"}}_content{{/crossLink}} setter.
	 * @method         setContent
	 * @param          {DOM.Node}    cntn
	 */
	this.setContent = function(cntn){
		if (cntn instanceof Node){
			_content = cntn;
		}
	};

	/**
	 * {{#crossLink "Dom/_content:property"}}_content{{/crossLink}} getter.
	 * @method   getContent
	 * @return   {DOM.Node}
	 */
	this.getContent = function(){
		return _content;
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
	    // console.log('from parents: ', _lookUpInParents(n, prop));
	    stl = new Properties(n.getAttribute(attrName));
	    stl.setMode(1);
	    stl.toggleProperty(prop, val, altVal);
	    stlStr = stl.toString();
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
				stl = new Properties(currentNode.getAttribute('style'));
				stl.setMode(1);
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
	// var _deferToggleStyle = function(n, prop, val, altVal){
	//     var childNodes = n.childNodes,
	//         childNum = childNodes.length,
	//         child, span, parent, counter;
	//     switch (childNum){
	//          // node has no children
	//         case 0:
	//             if (n.nodeType === Node.ELEMENT_NODE){
	//                 _toggleNodeStyle(n, prop, val, altVal);
	//                 break;
	//             }
	//             if (n.nodeType === Node.TEXT_NODE){
	//                 console.log('from parents: ', _lookUpInParents(n, prop));
	//                 span = new Tag();
	//                 span.setTag('span');
	//                 span.setStyleProperty(prop, val);
	//                 span.setContent(n.nodeValue);
	//                 parent = n.parentNode;
	//                 if (parent){
	//                     parent.replaceChild(span.toNode(), n);
	//                 }
	//                 break;
	//             }
	//             break;
	//         // node has only one child
	//         case 1:
	//             child = n.firstChild;
	//             if (child.nodeType === Node.TEXT_NODE){
	//                  _toggleNodeStyle(n, prop, val, altVal);
	//             } else {
	//                 _deferToggleStyle(child, prop, val, altVal);
	//             }
	//             break;
	//         // node has many children
	//         default:
	//             console.log("children no. : ", childNum, childNodes);
	//             for (counter = 0; counter < childNum; counter++){
	//                 _deferToggleStyle(childNodes[counter], prop, val, altVal);
	//             }
	//     }
	// };




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

	// /**
	//  * Normalize parent of elements of the array.
	//  * @method  normalizeParentOf
	//  * @param  {Array}     elems
	//  * @return {void}
	//  */
	// this.normalizeParentOf = function(elems){
	//     var el = this.commonAncestorSoft(elems);
	//     if (el){
	//         el.normalize();
	//     }
	// };


	/**
	 * Returns the nearest node from which `node` inherits inline style property `key`. If no such node exists, returns `undefined`.
	 * @method         getMentor
	 * @param          {String}             key               name of inline style property
	 * @param          {DOM.Node}           node              [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @return         {DOM.Node|undefined}                   [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 */
	this.getMentor = function(key, node){
		var currentNode = node,
			stl;
		// if the scope is not defined or if it is erraneous, impose scope to be the root.
		while (currentNode){
			// whether the current node has attributes
			if (typeof currentNode.getAttribute === 'function'){
				stl = new Properties(currentNode.getAttribute('style'));
				if (stl.hasProperty(key)){
					return currentNode;
				}
			}
			currentNode = currentNode.parentNode;
		}
	};

	/**
	 * Nails inline style property `key` of `node`:  applies style property on "innocent" nodes
	 * and toggles node inline property `key` between `primary` and `secondary`.
	 *
	 * If `node` has a mentor node, then:
	 * <ol><li>
	 * assign value of inline style property `key` of the mentor to each
	 * {{#crossLink "Dom/complementNodes:method"}}complement node{{/crossLink}} to the path `mentor - ... - node`,
	 * </li><li>
	 * eliminate inline style property `key` from the mentor,
	 * </li><li>
	 * call {{#crossLink "Dom/setStyleProperty:method"}}setStyleProperty{{/crossLink}} method that takes care of
	 * setting inline style property of `node` to required value.
	 * </li></ol>
	 * If `node` has no mentor node, then set its inline style property `key` to be equal to `secondary`
	 * @method         nailStyleProperty
	 * @param          {DOM.Node}           node             [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @param          {String}             key              name of inline style property
	 * @param          {String|Number}      primary          primary value of inline style property
	 * @param          {String|Number}      secondary        secondary value of inline style property
	 * @return         {void}
	 */
	this.nailStyleProperty = function(node, key, primary, secondary){
		var mentor = this.getMentor(key, node);
		// changing target node if there is no mentor
		if (mentor === undefined){
			this.setStyleProperty(node, key, primary);
			return;
		}
		// from now on, mentor exists.
		// It might coincide with the node (in this case, array of complement nodes is empty).
		var complNodes = this.complementNodes(mentor, node),
			len = complNodes.length,
			mentorStyle = this.getStyleProperty(mentor, key),
			i;
		// apply mentor's style property on complement nodes
		for (i = 0; i < len; i++){
			this.setStyleProperty(complNodes[i], key, mentorStyle);
		}
		// drop the property from the mentor
		this.dropStyleProperty(mentor, key);
		// impose secondary value of the style property on the target node
		this.setStyleProperty(node, key, mentorStyle === primary ? secondary : primary);
	};


	/**
	 * Returns reference to a node with inline style property `key` being set to `value`.
	 * If `node` is a [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance,
	 * then reference it itself is returned. Otherwise, it is returned a new
	 * [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance, which contains
	 * a clone of `node` and which replaces `node`.
	 * @method         setStyleProperty
	 * @param          {DOM.Node}           node     [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @param          {String}             key      name of inline style property to set
	 * @param          {String|Number}      value    value of the inline style property
	 * @return         {DOM.Node}                    [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)
	 */
	this.setStyleProperty = function(node, key, value){
		if (!node || !key || !value){
			throw new Error('Node, key and value must be given!');
		}
		var attrName = 'style',
			isElem = node.nodeType === Node.ELEMENT_NODE,
			node2 = isElem ? node : document.createElement('span'),
			style = new Properties(node2.getAttribute(attrName));
		style.setMode(1);
		style.setProperty(key, value);
		node2.setAttribute(attrName, style.toString());
		// arrange the node if it was created as a span
		if (!isElem){
			node2.appendChild(node.cloneNode(false));
			node.parentNode.replaceChild(node2, node);
		}
		return node2;
	};

	/**
	 * Gets inline style property with name `key` of `node`. Returns `undefined` if `node`
	 * does not have inline style property `key`.
	 * @method         getStyleProperty
	 * @param          {DOM.Node}           node          [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @param          {String}             key           name of inline style property of `node`
	 * @return         {String|Number}
	 */
	this.getStyleProperty = function(node, key){
		if (node && key && typeof node.getAttribute === 'function'){
			var stl = new Properties(node.getAttribute('style'));
			if (stl.hasProperty(key)){
				return stl.getProperty(key);
			}
		}
	};


	/**
	 * Drops inline style property `key` from `node` and removes inline style attribute if
	 * it becomes empty.
	 * Returns `true` if the initially contains inline style property `key` and `false` otherwise.
	 *
	 * @method         dropStyleProperty
	 * @param          {DOM.Node}           node      [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @param          {String}             key       name of inline style attribute to drop
	 * @return         {Boolean}                      `true` if successefully deleted the requested property
	 *                                                 and `false` otherwise
	 */
	this.dropStyleProperty = function(node, key){
		if (!node || !key || typeof node.getAttribute !== 'function'){
			return false;
		}
		var attrName = 'style';
		var stl = new Properties(node.getAttribute(attrName));
		if (!stl.hasProperty(key)){
			return false;
		}
		stl.dropProperty(key);
		if (stl.isEmpty()){
			node.removeAttribute(attrName);
		} else {
			node.setAttribute(attrName, stl.toString());
		}
		return true;
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
				stl = new Properties(elem.getAttribute(attrName)),
				styleValue = this.getInheritedStyleProp(key, elem);
			stl.setMode(1);
			stl.setProperty(key, (styleValue === primary) ? secondary :  primary);
			elem.setAttribute(attrName, stl.toString());
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
	 * @param          {String}             key             name of style property (i.e., "text-decoration", "font-style")
	 * @param          {String|Number}      primary         primary value of the style property
	 * @param          {String|Number}      secondary       secondary value
	 * @return         {DOM.Node}
	 * @since          0.0.4
	 */
	this.createToggledElemFromText = function(textNode, key, primary, secondary){
		if (textNode && textNode.nodeType === Node.TEXT_NODE){
			var output = document.createElement('span'),
				textNodeCopy = document.createTextNode(textNode.nodeValue),
				styleValue = this.getInheritedStyleProp(key, textNode),
				styleToggled = styleValue === primary ? secondary : primary;
			output.setAttribute('style', key + ': ' + styleToggled + ';');
			output.appendChild(textNodeCopy);
			return output;
		}
	};


	/**
	 * Returns a one-dimensional array of [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instances
	 * that are descendants of `startNode-...-endNode` path but do not belong to that path.
	 * If path from `startNode` to `endNode` does not exist, an error is thrown.
	 * <dl>
	 * <dt> Path A - ... - B</dt>
	 * <dd> An ordered collection of nodes n<sub>i</sub> from which one needs to pass through in order
	 * to arrive to node B starting from node A passing always from a node to its child.
	 * </dd>
	 * <dt> Descendant of a path A - ... - B</dt>
	 * <dd>
	 * 	A node C is a descendant of A - ... - B path if parent of node C belongs to A - ... - B path.
	 * </dd>
	 * </dl>
	 * @method         complementNodes
	 * @param          {DOM.Node}           startNode          a [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)
	 *                                                         instance from which to start the path
	 * @param          {DOM.Node}           endNode            a [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)
	 *                                                         instance at which to finish the path
	 * @return         {Array}                                 one-dimensional array of
	 *                                                         [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)
	 *                                                         instances or empty array
	 */
	this.complementNodes = function(startNode, endNode){
		if (!startNode.contains(endNode)){
			throw new Error("Start node must contain the end one!");
		}
		if (startNode.isEqualNode(endNode)){
			return [];
		}
		var children = startNode.childNodes,
			len = children.length,
			i, child,
			result = [];
		for (i = 0; i < len; i++){
			child = children[i];
			if (!child.contains(endNode)){
				result.push(child);
			} else {
				result = result.concat(this.complementNodes(child, endNode));
			}
		}
		return result;
	};

	/**
	 * Replaces `propSecondary` string by `propPrimary` one in the class attribute of `elem`.
	 * If `propSecondary` does not exist, then `propPrimary` is just appended to class
	 * attributes. If class attribute does not exist, then it is created with value `propName`.
	 * @method         switchClassProperty
	 * @param          {DOM.Element}   elem
	 * @param          {String}        propPrimary
	 * @param          {String}        propSecondary
	 * @return         {void}
	 * @since          0.0.6
	 */
	this.switchClassProperty = function(elem, propPrimary, propSecondary){
		var attrName = 'class';
		var classValue = elem.getAttribute(attrName);
		if (!classValue){
			elem.setAttribute(attrName, propPrimary);
			return;
		}
		var attrValues = classValue.split(' ');
		var index = attrValues.indexOf(propSecondary);
		if (index !== -1){
			// replace secondary-switch attribute
			attrValues[index] = propPrimary;
		} else if (attrValues.indexOf(propPrimary) === -1) {
			// insert secondary-switch attribute only if it is not already present
			attrValues.push(propPrimary);
		}
		classValue = attrValues.join(' ');
		elem.setAttribute(attrName, classValue);
	};

	/**
	 * Returns a Properties instance that accumulates the highest specificity attributes and styles of
	 * node `n` within the scope `s` (included).
	 *
	 * The method parses DOM ascending from the node `n` up to node `s` (included) and accumulates only those
	 * styles/attributes that have not been set so far: that is if an attribute encouters more than once,
	 * only its first occurence gets into consideration.
	 *
	 * If node `s` is not set, then parsing is performed up to the "highest" root.
	 * If node `s` is set, but node `n` is not its descendant, then a
	 * {{#crossLink "Properties"}}Properties{{/crossLink}} instance corresponding to node `n`
	 * is returned.
	 * @method  	   getInheritedProperties
	 * @param          {DOM.Element}   n
	 * @param          {DOM.Element}   s   Optional
	 * @return         {Properties}
	 * @since          0.0.7
	 */
	this.getInheritedProperties = function(n, s){
		var p = new Properties();
		if (!n){
			return p;
		}
		p.loadNodeProperties(n);
		var naturalLimit = s === undefined;
		if (!(naturalLimit || s.contains(n))){
			return p;
		}
		var currentNode = n.parentNode,
			currentProp;
		while (currentNode && (naturalLimit || s.contains(currentNode))){
			currentProp = new Properties();
			currentProp.loadNodeProperties(currentNode);
			p.suggestProperty(currentProp);
			currentNode = currentNode.parentNode;
		}
		return p;
	};


	/********************* Selection.js start *********************************************/
	// "use strict";
	// if (!(this instanceof Selection)) {
	//     return new Selection(ed);
	// }

	// if (ed !== undefined && !(ed instanceof CKEDITOR.editor)){
	//     throw new Error('The first argument must be a CKEDITOR.editor instance!');
	// }

	// /**
	// * Editor instance containing the selection.
	// * @property        {CKEDITOR.editor}         editor
	// * @private
	// */
	// var editor = ed;

	// /**
	// * Selected elements.
	// * @property        {CKEDITOR.dom.selection}  selected
	// * @private
	// */
	// var selected;
	// if (editor instanceof CKEDITOR.editor){
	//     selected = editor.getSelection();
	// }

	// /**
	// * Array of [range instances](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.range) corresponding to the selection.
	// * @property {Array}   ranges
	// * @private
	// */
	// var ranges;
	// if (selected instanceof CKEDITOR.dom.selection){
	//     ranges = selected.getRanges();
	// }

	// /**
	//  * {{#crossLink "Selection/ranges:property"}}ranges{{/crossLink}} getter.
	//  * @method         getRanges
	//  * @return         {Array}          array of CKEDITOR.dom.range instances
	//  */
	// this.getRanges = function(){
	//     return ranges;
	// };

	// /**
	//  * {{#crossLink "Selection/selected:property"}}selected{{/crossLink}} setter. Sets as well
	//  * {{#crossLink "Selection/ranges:property"}}ranges{{/crossLink}}.
	//  * @method         setSelected
	//  * @return         {void}
	//  */
	// this.setSelected = function(obj){
	//     if (!(obj instanceof CKEDITOR.dom.selection)){
	//         throw new Error('The argument must be a CKEDITOR.dom.selection instance!');
	//     }
	//     selected = obj;
	//     ranges = selected.getRanges();
	// };

	// /**
	//  * {{#crossLink "Selection/selected:property"}}selected{{/crossLink}} getter.
	//  * @method         getSelected
	//  * @return         {CKEDITOR.dom.selection}
	//  * @private
	//  */
	// this.getSelected = function(){
	//     return selected;
	// };


	// /**
	//  * {{#crossLink "Selection/editor:property"}}editor{{/crossLink}} getter.
	//  * @method         getEditor
	//  * @return         {CKEDITOR.editor}
	//  */
	// this.getEditor = function(){
	//     return editor;
	// };

	// /**
	//  * {{#crossLink "Selection/editor:property"}}editor{{/crossLink}} setter. Sets as well
	//  * {{#crossLink "Selection/selected:property"}}selected{{/crossLink}} and
	//  * {{#crossLink "Selection/ranges:property"}}ranges{{/crossLink}}.
	//  * @method        setEditor
	//  * @param         {CKEDITOR.editor}     obj
	//  */
	// this.setEditor = function(obj){
	//     if (!(obj instanceof CKEDITOR.editor)){
	//         throw new Error('The argument must be a CKEDITOR.editor instance!');
	//     }
	//     editor = obj;
	//     selected = obj.getSelection();
	//     ranges = (selected instanceof CKEDITOR.dom.selection) ? selected.getRanges() : null;
	// };

	// /**
	// * If selection is empty, returns empty array. Otherwise returns two dimensional array of the form
	// * <pre>
	// * [[a<sub>00</sub>, a<sub>01</sub>, ...], [a<sub>10</sub>, a<sub>11</sub>, ...], ...].
	// * </pre>
	// * Each inner array corresponds to the elements inside the
	// * {{#crossLink "Selection/ranges:property"}}ranges{{/crossLink}} property of the selection.
	// * Since DOM is an ***ordered*** collection of the nodes, the the above mentioned array is
	// * just a collection of simply-connected sets of nodes corresponding to the selection.
	// *
	// * NB1: _Simply-connected_ set is a set such that there exists a path inside the set
	// * connecting two arbitrary elements of the set.
	// *
	// * NB2: _Path_ consists of pieces connecting two neighbours (the set is ordered, so that
	// * the concept of "neighbour" exists).
	// * @method          selectedNodes
	// * @param           {Selection}          sel
	// * @private
	// * @return          {Array}              two dimensional array of
	// *                                       [CKEDITOR.dom.domObject](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.domObject)
	// *                                       or empty array
	// */
	// var selectedNodes = function(sel){
	//     var startContainer, endContainer,
	//         startOffset, endOffset,
	//         rangesLocal = sel.getRanges(),
	//         range, startChild, endChild, nextChild,
	//         lastBlock = [],
	//         firstBlock = [],
	//         middleBlock = [],
	//         startElem, endElem,
	//         startType, endType,
	//         i, rangesLen, commonAnc,
	//         selNodes = [],      // container for all sel nodes
	//         rangeNodes;         // container for sel nodes in current range
	//     if (rangesLocal){
	//         rangesLen = rangesLocal.length;
	//         for (i = 0; i < rangesLen; i++){
	//             // console.info('loop', i);
	//             rangeNodes = [];
	//             range = rangesLocal[i];
	//             if (!range.collapsed) {
	//                 startContainer = range.startContainer;
	//                 endContainer = range.endContainer;
	//                 startType = startContainer.type;
	//                 endType   = endContainer.type;
	//                 startOffset = range.startOffset;
	//                 endOffset = range.endOffset;
	//                 startElem = null;
	//                 endElem = null;
	//                 lastBlock = [];
	//                 firstBlock = [];
	//                 middleBlock = [];

	//                 if (startContainer.equals(endContainer)){
	//                     // console.log('start = end');
	//                     if (startType === CKEDITOR.NODE_TEXT){
	//                         startElem = startContainer.split(startOffset).split(endOffset - startOffset).getPrevious();
	//                         endElem = startElem;
	//                     } else if (startType === CKEDITOR.NODE_ELEMENT){
	//                         startElem = startContainer.getChild(startOffset);
	//                         // endElem = startContainer.getChild(endOffset) || startElem;
	//                         endElem = startElem;
	//                     }
	//                 } else {
	//                     if (endType === CKEDITOR.NODE_TEXT){
	//                         endElem = endContainer.getLength() === endOffset ? endContainer : endContainer.split(endOffset).getPrevious();
	//                     } else if (endType === CKEDITOR.NODE_ELEMENT){
	//                         if (endOffset > 0){
	//                             endElem = endContainer.getChild(endOffset - 1);
	//                         } else {
	//                             endElem = endContainer.getParent();
	//                         }
	//                     }
	//                     if (startType === CKEDITOR.NODE_TEXT){
	//                         // Do not split the element if its length is equal to offset.
	//                         // In this case, take the next sibling of the element.
	//                         startElem = startContainer.getLength() === startOffset ? startContainer.getNext() : startContainer.split(startOffset);
	//                         // startElem =  startContainer.split(startOffset);
	//                     } else if (startType === CKEDITOR.NODE_ELEMENT){
	//                         startElem = startContainer.getChild(startOffset);
	//                     }

	//                 }
	//                 if (startElem === null || endElem === null){
	//                     // console.log('start elem or end elem is null: ', startElem, endElem);
	//                     break;
	//                 }
	//                 // console.log('start elem: ', startElem, ', end elem: ', endElem);
	//                 if (CKHelper.containsOrEqual(startElem, endElem)){
	//                     rangeNodes = [startElem];
	//                 } else if (CKHelper.containsOrEqual(endElem, startElem)) {
	//                     rangeNodes = [endElem];
	//                 } else {
	//                     commonAnc = startElem.getCommonAncestor(endElem);
	//                     startChild = CKHelper.childWithNode(commonAnc, startElem);
	//                     endChild = CKHelper.childWithNode(commonAnc, endElem);

	//                     firstBlock = startElem.getParent().equals(commonAnc) ? [startElem] : CKHelper['bunch-next-siblings'](startElem, startChild);
	//                     // console.log('firstBlock: ', firstBlock);
	//                     rangeNodes = rangeNodes.concat(firstBlock);
	//                     // console.log('rangeNodes after adding first block: ', rangeNodes.length, ', ', rangeNodes);
	//                     nextChild = startChild.getNext();
	//                     while(nextChild && !nextChild.equals(endChild)){
	//                         // console.log('pushing nextChild: ', nextChild);
	//                         middleBlock.push(nextChild);
	//                         nextChild = nextChild.getNext();
	//                     }
	//                     // console.log('middleBlock: ', middleBlock);
	//                     rangeNodes = rangeNodes.concat(middleBlock);

	//                     lastBlock = endElem.getParent().equals(commonAnc) ? [endElem] : CKHelper['bunch-prev-siblings'](endElem, endChild);

	//                     // console.log('lastBlock: ', lastBlock);
	//                     rangeNodes = rangeNodes.concat(lastBlock.reverse());
	//                     // console.log('rangeNodes after adding end block: ', rangeNodes.length, ', ', rangeNodes);
	//                 }

	//             }
	//             // console.log('rangeNodes that are to be pushed into selNodes: ', rangeNodes);
	//             selNodes.push(rangeNodes);
	//         }


	//     }
	//     // selNodes.forEach(function(elem, ind){
	//     //     elem.forEach(function(elem2, ind2){
	//     //         console.log(ind, ind2, elem2);
	//     //     });
	//     // });
	//     return selNodes;
	// };

	// *
	//  * Two-dimensional array of nodes in selection.
	//  *
	//  * This property was created in order to assure that private method
	//  * {{#crossLink "Selection/selectedNodes:method"}}selectedNodes{{/crossLink}} gets called
	//  * just once because it seemingly modifies DOM in such
	//  * a way that if one calles it multiple times, a wrong array offset is requested, hence, an
	//  * error is generated.
	//  * @property       {Array}      nodes
	//  * @type           {Array}      array of [CKEDITOR.dom.domObject](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.domObject)

	// this.nodes = selectedNodes(this);

	// /**
	//  * Returns text representation of the selected nodes. Remember that they are located inside a two-dimensional array.
	//  *
	//  * @method    toText
	//  * @param     {String}    blockSeparator          string to be used as a separator between arrays
	//  * @param     {String}    elemSeparator           string to be used as a separator between elements in array
	//  * @return    {String}
	//  */
	// this.toText = function(blockSeparator, elemSeparator){
	//     var total = [];
	//     blockSeparator = blockSeparator || ' ';
	//     elemSeparator = elemSeparator || ' ';
	//     this.nodes.forEach(function(arr){
	//         var arrayNested = [];
	//         arr.forEach(function(el){
	//             if (el.type === CKEDITOR.NODE_TEXT || el.type === CKEDITOR.NODE_ELEMENT){
	//                 arrayNested.push(el.getText());
	//             }
	//         });
	//         total.push(arrayNested.join(elemSeparator));
	//     });
	//     return total.join(blockSeparator);
	// };


	// /**
	//  * Returns the start element of selection if it exists.
	//  * @method         getStartElement
	//  * @return         {CKEDITOR.dom.element}
	//  */
	// this.getStartElement = function(){
	//     var sel = this.getSelected();
	//     if (sel instanceof CKEDITOR.dom.selection){
	//         return sel.getStartElement();
	//     }
	// };

	// /**
	//  * Returns `true` if {{#crossLink "Selection/selectedNodes:method"}}selectedNodes{{/crossLink}} is empty,
	//  * `false` otherwise.
	//  *
	//  * {{#crossLink "Selection/selectedNodes:method"}}selectedNodes{{/crossLink}} output is considered empty
	//  * if it is either empty array `[]` or an array containing empty array: `[[]]`.
	//  * @method         isEmpty
	//  * @return         {Boolean}
	//  */
	// this.isEmpty = function(){
	//     var s = this.nodes;
	//     // console.log('selected nodes'  , s);
	//     //    empty array []  or containing empty array [[]]
	//     return s.length === 0 || (s.length === 1 && s[0].length === 0);
	// };


	// /**
	//  * Returns `true` if selected text starts inside a link, `false` otherwise.
	//  * In case when the selection is empty, cursor position is considered as beginning
	//  * of empty selection.
	//  * @method         startsInsideLink
	//  * @return         {Boolean}            whether the selection starts inside a link
	//  */
	// this.startsInsideLink = function(){
	//     var start = this.getStartElement(),
	//         parentLink = null;
	//     if (start !== undefined && start !== null && (typeof start.getAscendant === 'function')){
	//         parentLink = start.getAscendant('a', true);
	//     }
	//     return parentLink !== null;
	// };


	// /**
	//  * Returns `true` if selection content is editable, `false` otherwise.
	//  *
	//  * Selection is editable if:
	//  * <ol>
	//  * <li>it is empty</li>
	//  * <li>it contains a single element that has type `text`</li>
	//  * <li>it contains a single element that is a link which child nodes are of type `text`</li>
	//  * </ol>
	//  * @method         isEditable
	//  * @return         {Boolean}
	//  */
	// this.isEditable = function(){
	//     var nodes = this.nodes;
	//     if (!nodes){
	//         // console.log('nodes are not defined');
	//         return true;
	//     }
	//     var len = nodes.length;
	//     // exit point if the nodes array length differs form one
	//     if (len !== 1){
	//         // return true if it is empty and false if it is too long
	//         return len === 0;
	//     }

	//     // the first (and the only) block of the selection
	//     var firstBlock = nodes[0];
	//     len = firstBlock.length;
	//     // exit point if the firstblock is empty or has more than one element
	//     if (len !== 1){
	//         // return true if it is empty and false if it is too long
	//         return len === 0;
	//     }

	//     // the only element
	//     var elem = firstBlock[0];
	//     if (elem.type === CKEDITOR.NODE_TEXT){
	//         return true;
	//     }
	//     if (elem.type === CKEDITOR.NODE_ELEMENT){
	//         if (elem.getName() === 'a'){
	//             len = elem.getChildCount();
	//             if (len !== 1){
	//                 return len === 0;
	//             }
	//             return elem.getChild(0).type === CKEDITOR.NODE_TEXT;
	//         }
	//         return false;
	//     }
	//     return false;

	// };

	// /**
	//  * Removes duplicate DOM nodes form input array. Each element of the array must be an instance of
	//  * [CKEDITOR.dom.domObject](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.domObject).
	//  * @method         dropDuplicates
	//  * @private
	//  * @param          {Array}              $arr    one-dimensional array of
	//  *                                              [CKEDITOR.dom.domObject](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.domObject)
	//  *                                              objects
	//  * @return         {Array}                      array of distinct
	//  *                                              [CKEDITOR.dom.domObject](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.domObject)
	//  *                                              elements
	//  */
	// var dropDuplicates = function(arr){
	//     var len = arr.length;
	//     if (len === 0 || len === 1){
	//         return arr;
	//     }
	//     if (len > 1){
	//         var first = arr[0],
	//             output = [],
	//             outputLen = 0,
	//             i, j,
	//             isPresent;
	//         output.push(first);
	//         outputLen++;

	//         for (i = 1; i < len; i++){
	//             isPresent = false;
	//             for (j = 0; j < outputLen; j++){
	//                 if (output[j].equals(arr[i])){
	//                     isPresent = true;
	//                     break;
	//                 }
	//             }
	//             if (!isPresent){
	//                 output.push(arr[i]);
	//                 outputLen++;
	//             }
	//         }
	//         return output;
	//     }
	// };

	// /**
	//  * Replaces each element in {{#crossLink "Selection/selected:property"}}selected{{/crossLink}} by
	//  * a link in which this element is located. In case the element is not located inside any link, then it
	//  * is leaved without changes. The output array mimics the structure of
	//  * {{#crossLink "Selection/selected:property"}}selected{{/crossLink}} array: it should be a two-dimensional array
	//  * without duplicates.
	//  * @method         absorbLink
	//  * @return         {void}
	//  */
	// this.absorbLink = function(){
	//     var input = this.nodes,
	//         output = [],
	//         temp, link;
	//     if (this.isEmpty()){
	//         // if the selection is empty and the cursor is inside a link,
	//         // insert this link into nodes
	//         link = this.getStartElement().getAscendant('a', true);
	//         if (link){
	//             output.push([link]);   // resulting array must be 2-dimensional with a single element
	//         }
	//     } else {
	//         // parse elements in the selectionif it is not empty
	//         input.forEach(function(block){
	//             if (Array.isArray(block) && block.length > 0){
	//                 temp = [];
	//                 block.forEach(function(elem){
	//                     link = elem.getAscendant('a', true);
	//                     temp.push(link || elem) ;
	//                 });
	//                 output.push(dropDuplicates(temp));
	//             }
	//         });

	//     }
	//     this.nodes = output;
	// };

	// /**
	//  * Propagate style property named `prop` with the value `val` to the last descendant of each node in the selection.
	//  * Remember that the selection is in general a two-dimensional array (or one-dimensional if the selection is empty).
	//  *
	//  * Update: added possibility for `prop` to be an object (in this case the rest argument are ignored)
	//  * with the following keys: <ol><li>
	//  * `name` - name of the style property
	//  * </li><li>
	//  * `value` - on-value of the above property
	//  * </li><li>
	//  * `altVal` - off-value of the above property
	//  * </li></ol>
	//  *
	//  * @method         switchDeepestChildStyle
	//  * @param          {String|Object}        prop        name of the property to be imposed
	//  * @param          {String}               val         on-value of the above property
	//  * @param          {String}               altVal      off-value of the property
	//  * @since          0.0.4
	//  * @return         {void}
	//  */
	// this.switchDeepestChildStyle = function(prop, val, altVal){
	//     var propName, value, altValue;
	//     if (typeof prop === 'object'){
	//         propName = prop.name;
	//         value = prop.value;
	//         altValue = prop.altValue;
	//     } else {
	//         propName = prop;
	//         value = val;
	//         altValue = altVal;
	//     }
	//     this.nodes.forEach(function(line){
	//         var dom = new Dom();
	//         if (line){
	//             line.forEach(function(node){
	//                 dom.nailStyleProperty(node.$, propName, value, altValue);
	//             });
	//         }
	//     });
	// };


	// /**
	//  * Returns first ancestor of {{#crossLink "Selection/nodes:property"}}nodes{{/crossLink}} for which `criteria` evaluates to
	//  * `true`.
	//  *
	//  * To function `criteria` there will be given one by one elements from {{#crossLink "Selection/nodes:property"}}nodes{{/crossLink}}
	//  * @method  findAcsendant
	//  * @param  {Function} criteria [description]
	//  * @return {CKEDITOR.dom.element}  [CKEDITOR.dom.element](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.element)
	//  */
	// this.findAscendantOfBlock = function(criteria){
	//     if (this.isEmpty()){
	//         return;
	//     }
	//     var lenExt = this.nodes.length,
	//         lenInt, i, j, block, el;
	//     for (i = 0; i < lenExt; i++){
	//         block = this.nodes[i];
	//         lenInt = block.length;
	//         for (j = 0; j < lenInt; j++){
	//             el = block[j];
	//             if (criteria(el)){
	//                 return el;
	//             }
	//         }
	//     }
	// };
/**************** Selection.js end *************************************************/

}

