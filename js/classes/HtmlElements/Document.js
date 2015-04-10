/*jslint plusplus: true, white: true */
/*global Element, Text, Node, Properties, Tag, NEWSLETTER, Converter, Mapper, Range, List, ListItem */

/**
 * This class allows to parse, convert, save etc. html documents.
 *
 * @module 	    Document
 * @class  		Document
 * @since       0.0.5
 * @author      A.Shcherbakov
 * @uses        Properties        class to deal with Properties of document nodes
 */

function Document(){
	"use strict";
	if (!(this instanceof Document)) {
		return new Document();
	}


	/**
	 * (Optional) Styles to be applied to overall content of the newsletter before saving it.
	 *
	 * If set, it is supposed to be an instance of {{#crossLink "Properties"}}Properties{{/crossLink}}
	 * class with {{#crossLink "Properties/_mode:property"}}_mode{{/crossLink}} to be set to correspond
	 * to in-line styles.
	 * @property       {Properties}    _wrapCss
	 * @private
	 * @since          0.0.6
	 */
	var _wrapCss;


	/**
	 * Instance of {{#crossLink "Converter"}}Converter{{/crossLink}}. Its responsibility is to convert
	 * current instance into different formats.
	 * @property       {Converter}          _converter
	 * @default        Converter
	 * @private
	 */
	var _converter = new Converter(NEWSLETTER.formatMapper || (new Mapper()));

	/**
	 * {{#crossLink "Document/_converter:property"}}_converter{{/crossLink}} setter. Supposed to be an
	 * instance of {{#crossLink "Converter"}}Converter{{/crossLink}} though no validation control is
	 * performed.
	 * @method         setConverter 0:0
	 * @param          {Any}                c
	 * @return         {void}
	 */
	this.setConverter = function(c){
		_converter = c;
	};

	/**
	 * {{#crossLink "Document/_converter:property"}}_converter{{/crossLink}} getter.
	 * @method         getConverter 1:0
	 * @return         {Any}                Supposed to be an instance of
	 *                                      {{#crossLink "Converter"}}Converter{{/crossLink}}
	 */
	this.getConverter = function(){
		return _converter;
	};

	/**
	 * Factory to construct {{#crossLink "Tag"}}Tag{{/crossLink}} instances and its descendants
	 * @property {Object} _factory
	 * @since  0.1.0
	 * @private
	 */
	var _factory;

	/**
	 * {{#crossLink "Document/_factory:property"}}_factory{{/crossLink}} getter.
	 * @method         getFactory 3:2
	 * @return         {Object|null}
	 * @since          0.1.0
	 */
	this.getFactory = function(){
		return _factory;
	};

	/**
	 * {{#crossLink "Document/_factory:property"}}_factory{{/crossLink}} setter.
	 * @method         setFactory  0:15
	 * @param          {Object}             f          an object to used as a factory
	 * @return         {void}
	 * @since          0.1.0
	 */
	this.setFactory = function(f){
		_factory = f;
	};


	/**
	 * Sets {{#crossLink "Converter/_mapper:property"}}_mapper{{/crossLink}} of
	 * {{#crossLink "Document/_converter:property"}}_converter{{/crossLink}}.
	 * Alias for {{#crossLink "Converter/setMapper:method"}}setMapper{{/crossLink}} method.
	 * @method         setMapper 0:0
	 * @param          {void}               m
	 */
	this.setMapper = function(m){
		_converter.setMapper(m);
	};



	/**
	 * Escapes "tricky" symbols by their html code representations.
	 *
	 * After execution of this method, special symbols inside text nodes of
	 * `n` are substituted by their html representations.
	 *
	 * @method         escape 0:0
	 * @param          {Node}          n
	 * @return         {void}
	 * @since          0.0.6
	 */
	this.escape = function(n){
		/// !!! stub
		console.log('method escape() is to be implemented');
	};

	/**
	 * {{#crossLink "Document/_wrapCss:property"}}_wrapCss{{/crossLink}} setter.
	 *
	 * If necessary, the argument is transformed into a
	 * {{#crossLink "Properties"}}Propreties{{/crossLink}} instance,
	 * and then assigned to {{#crossLink "Document/_wrapCss:property"}}_wrapCss{{/crossLink}}.
	 * @method         setWrapCss 0:1
	 * @param          {Any}        css
	 * @since          0.0.6
	 */
	this.setWrapCss = function(css){
		_wrapCss = (css instanceof Properties) ? css : new Properties(css);
		_wrapCss.setMode(Properties.MODE_STYLE);
	};

	/**
	 * {{#crossLink "Document/_wrapCss:property"}}_wrapCss{{/crossLink}} getter.
	 * @method         getWrapCss 1:0
	 * @return         {Properties}
	 * @since          0.0.6
	 */
	this.getWrapCss = function(){
		return _wrapCss;
	};

	/**
	 * Creates a valid html document whose body is given by `content`.
	 *
	 * **NB**: it uses css of the editor content body.
	 * @method         docHtml 0:1
	 * @param          {Node}              node
	 * @return         {String}            content of html document
	 */
	this.docHtml = function(node){
		var wrapCss = this.getWrapCss(),
			bodyCssStr = wrapCss ? wrapCss.toString() : '';
		if (bodyCssStr){
			bodyCssStr = ' style="' + bodyCssStr + '"';
		}
		var bodyContent = (node instanceof Node) ? node.innerHTML : '';
		var header = "<!DOCTYPE html>\n<html>\n<head>\n<meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\">\n</head>\n<body>\n";
		var body = "<center>\n<div" + bodyCssStr + ">\n" + bodyContent +  "\n</div>\n</center>\n";
		var footer = "</body>\n</html>";
		return header + body + footer;
	};

	/**
	 * Converts {{#crossLink "Document/_content:property"}}_content{{/crossLink}} into prescribed format.
	 * @method         convertTo 0:1
	 * @param          {String}             format
	 * @param          {Node}               n
	 * @return         {void}
	 */
	this.convertTo = function(format, n){
		var c = this.getConverter();
		if (typeof c.convertTo === 'function'){
			return c.convertTo(n, format);
		}
	};


	/**
	 * Considers ancestors of node `n` which are descendants of optional node `scope` and chooses that node
	 * for which `criteria` returns `true`.
	 *
	 * If `scope` is not set, then the search is performed up to the highest root.
	 *
	 * If `scope` is set, but `n` is not its descendant, then an error is thrown.
	 * @method         findAncestor 3:2
	 * @param          {Node}          n          node from which the search is started
	 * @param          {Function}      criteria
	 * @param          {Node}          scope      [optional] node with which the search is finished
	 * @return         {Node}
	 * @since          0.0.8
	 */
	this.findAncestor = function(n, criteria, scope){
		var isScoped = scope !== undefined;
		if (scope && (typeof scope.contains === 'function') && !scope.contains(n)){
			throw new Error('Wrong scope!');
		}
		if (typeof criteria !== 'function'){
			throw new Error('Criteria must be a function!');
		}
		var currentNode = n, isFound;
		while (currentNode && (!isScoped || scope.contains(currentNode))){
			try {
				isFound = criteria(currentNode);
				if (isFound){
					return currentNode;
				}
			} catch(e){
				console.log('Error (' + e.name + ') when applying criteria to a node: ' + e.message);
			} finally {
				currentNode = currentNode.parentNode;
			}
		}
	};

	/**
	 * Finds duplicate-free array of ancestors of elements of `nodes` satisfying the criteria `crit`.
	 *
	 * @method         findAncestorsOfMany 2:0
	 * @param          {Array}         nodes    array of [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instances
	 * @param          {Function}      crit
	 * @return         {Array}         array of [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instances
	 * @since          0.2.0
	 */
	this.findAncestorsOfMany = function(nodes, crit){
		if (!Array.isArray(nodes) || (typeof crit !== 'function')){
			return undefined;
		}
		var res = [];
		nodes.forEach(function(node){
			var anc = this.findAncestor(node, crit);
			if (anc && (res.indexOf(anc) === -1)){
				res.push(anc);
			}
		}.bind(this));
		return res;
	};


	/**
	 * Whether the argument is a range.
	 *
	 * Returns `true` if the argument is a range, `false` otherwise.
	 *
	 * @method         isRange 0:0
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
	 * Returns array without duplicates of nodes that lay between `n1` and `n2` inclusively.
	 *
	 * The order in which the nodes appear in the DOM does not matter: the linkElem
	 * array starts with the node that appears first in the DOM.
	 *
	 * The linkElem array is a minimal one: <ol><li>
	 * any node laying between `n1` and `n2` is present in the array either "personally" or by means of its ancestor
	 * </li><li>
	 * all descendants of every node in the array lay between `n1` and `n2`
	 * </li></ol>
	 *
	 * @method         nodesBetween 1:0
	 * @since          0.0.8
	 * @param          {Node}          n1     left limit (ignore nodes that come before this node)
	 * @param          {Node}          n2     right limit (ignore nodes that come after this node)
	 * @return         {Array}         array of [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instances
	 */
	this.nodesBetween = function(n1, n2){
	    if (!(n1 instanceof Node) || !(n2 instanceof Node)){
	        return [];
	    }
	    // avoid further calculations if n1 and n2 is in fact the same node
	    if (n1 === n2){
	        return [n1];
	    }
	    // I decided to use pathTo() method in order to find common ancestor
	    // to avoid incorrect linkElem in case n1 and n2 have no common ancestor
	    // ("pathTo" is not able to detect this fact)
	    var comAns = this.commonAncestor(n1, n2);
	    if (!comAns){
	        return [];
	    }
	    // from now on, the commomn ancestor exists
	    var path1 = this.pathTo(n1, comAns),
	        path2 = this.pathTo(n2, comAns);
	    if (path1.length === 0){
	        return [n1];
	    }
	    if (path2.length === 0){
	        return [n2];
	    }
	    var ind1 = path1[0],
	        ind2 = path2[0],
	        linkElem = [],
	        order = this.compare(path1, path2),
	        left, right, indL, indR;
	    if (order !== 1 && order !== -1){
	    	/// case when order is equal to 0 corresponds to n1 = n2 and
	    	/// hence path1 = path2 = []. This case is elaborated above.
	    	/// it remains anly a case when the nodes somehow are not comparable
	    	/// (even it should never be the case since they supposed to have a common ancestor)
	    	return;
	    }
	    if (order === 1){
	        left = n2;
	        right = n1;
	        indL = ind2;
	        indR = ind1;
	    } else {
	        left = n1;
	        right = n2;
	        indL = ind1;
	        indR = ind2;
	    }
	    linkElem.push(left);
	    var nodesNext = this.bunchNextSiblings(left, comAns.childNodes[indL]),
	        nodesPrev = this.bunchPrevSiblings(right, comAns.childNodes[indR]);
	    if (Array.isArray(nodesNext) && nodesNext.length > 0) {
	        linkElem = linkElem.concat(nodesNext);
	    }
	    var i;
	    for (i = indL + 1; i < indR; i++){
	        linkElem.push(comAns.childNodes[i]);
	    }
	    if (Array.isArray(nodesPrev) && nodesPrev.length > 0) {
	        linkElem = linkElem.concat(nodesPrev);
	    }
	    linkElem.push(right);
	    return linkElem;
	};

	/**
	 * Compares paths `p1` and `p2`. The input arrays do not undergo any modification during the comparison.
	 *
	 * Returns
	 * <ul><li>
	 * `-1` if `p1` is less than `p2`
	 * </li><li>
	 * `0` if `p1` is equal `p2`
	 * </li><li>
	 * `-1` if `p1` is greater than `p2`
	 * </li></ul>
	 *
	 * Comparison is performed element-by-element. All coinciding elements situated at the beginning of
	 * each path are ignored and the remnants are compared.
	 * <ul><li>
	 * The path `p1` is said to be equal to the path `p2` if they both have empty remnants.
	 * </li><li>
	 * The path `p1` is said to be less than the path `p2` if one of the following holds:
	 * <ul><li>
	 * remnant of `p1` is empty and remnant of `p2` is not empty
	 * </li><li>
	 * first element of the remnant of `p1` is less than first element of remnant of `p2`.
	 * </li></ul>
	 * The path `p1` is said to be greater than the path `p2` if `p2` is less than `p1`.
	 * </li></ul>
	 * One may provide a function `c` to compare elements of `p1` and `p2` that must obey the following signature:
	 * <pre>c: e1 &times; e2 &rarr; {-1, 0, +1}</pre>
	 * If arguments of function `c` are not comparable, the linkElem of the whole method is not defined.
	 *
	 * If `p1` and `p2` can not be compared, nothing is returned.
	 * @method         compare 1:0
	 * @param          {Array}         p1        array of numbers
	 * @param          {Array}         p2        array of numbers
	 * @param          {Function}      c         [Optional] comparator
	 * @return         {-1|0|1|null}
	 * @since          0.0.8
	 */
	this.compare = function(p1, p2, c){
		/**
		 * Auxiliary function that compares `n-th` elements of `p1` and `p2` using comparator `fun`.
		 * @method  _compareAux
		 * @param   {Array}      p1       first array
		 * @param   {Array}      p2       second array
		 * @param   {Integer}    n        current position of elements to compare
		 * @param   {Function}   fun      comparator
		 * @return  {-1|0|1|Null}
		 * @private
		 */
	    var _compareAux = function(p1, p2, n, fun){
	        if (p1.length > n){
	            if (p2.length === n){
	                return 1;
	            }
	            var e1 = p1[n],
	                e2 = p2[n],
	                comp = fun(e1, e2);
	            if (comp === 1 || comp === -1){
	            	return comp;
	            }
	            if (comp === 0){
	                return _compareAux(p1, p2, n+1, fun);
	            }
	            return;
	        }
	        return p2.length === n ? 0 : -1;
	    };
	    if (Array.isArray(p1) && Array.isArray(p2)){
	    	var comparator = (typeof c === 'function') ? c :  function(x, y){ return (x === y ? 0 : (x > y ? 1 : -1));};
	        return _compareAux(p1, p2, 0, comparator);
	    }
	};




	/**
	 * Gives common ancestor of nodes `n1` and `n2`. If it does not exist, nothing is returned.
	 * @method         commonAncestor 1:0
	 * @param          {Node}           n1     [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @param          {Node}           n2     [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @return         {Node|Null}
	 * @since          0.0.8
	 */
	this.commonAncestor = function(n1, n2){
	    if (!((n1 instanceof Node) && (n2 instanceof Node))){
	        return;
	    }
	    if (this.contains(n1, n2)){
	        return n1;
	    }
	    if (this.contains(n2, n1)){
	        return n2;
	    }
	    var parent = n1.parentNode;
	    while (parent && !(this.contains(parent, n2))){
	        parent = parent.parentNode;
	    }
	    return parent;
	};

	/**
	 * Returns the longest common "head" of arrays `a1` and `a2`.
	 *
	 * Compares elements of the arrays from the beginning and if the elements are equal, insert it into the resulting array.
	 * @method         commonHead 0:0
	 * @param          {Array}         a1
	 * @param          {Array}         a2
	 * @return         {Array}
	 */
	this.commonHead = function(p1, p2){
	    var commonHeadAux = function(p1, p2, ind, acc){
	        if (p1.length === ind || p2.length === ind || p1[ind] !== p2[ind]){
	            return acc;
	        }
	        acc.push(p1[ind]);
	        return commonHeadAux(p1, p2, ind + 1, acc);
	    };
	    if (Array.isArray(p1) && Array.isArray(p2)){
	        return commonHeadAux(p1, p2, 0, []);
	    }
	};


	/**
	 * Returns the root of `n`.
	 *
	 * A node is called to be a root of a node `n` if it contains node `n` and has no parent (that is the node highest ancestor).
	 * @method         rootOf 0:0
	 * @param          {Node}          n
	 * @return         {Node|Null}
	 */
	this.rootOf = function(n){
	    if (!(n instanceof Node)){
	        return undefined;
	    }
	    var currentNode = n,
	        parent = n.parentNode;
	    while (parent){
	        currentNode = parent;
	        parent = parent.parentNode;
	    }
	    return currentNode;
	};

	/**
	 * Returns array of integers corresponding to arc numbers that one should follow
	 * in order to arrive from node `s` to node `n`. If node `s` is not set, then the path is
	 * given with respect to `s` highest parent.
	 * @since          0.0.8
	 * @method         pathTo 2:0
	 * @param          {Node}          n     [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @param          {Node|Null}     s     [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @return         {Array|Null}
	 */
	this.pathTo = function(n, s){
	    if (!(n instanceof Node) || !((s instanceof Node) || (s === undefined) )){
	        return;
	    }
	    var isScoped = (s !== undefined);
	    var path = [],
	        currentNode = n;

	    while (currentNode.parentNode && !(currentNode === s)){
	        path.unshift(this.indexOf(currentNode));
	        currentNode = currentNode.parentNode;
	    }
	    if (!isScoped || !s.parentNode || currentNode.parentNode){
	        return path;
	    }

	}.bind(this);

	/**
	 * Returns an element following `path` starting from element `ref`.
	 *
	 * If element is not found, nothing is returned.
	 * @method         getNodeByPath  0:0
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
	 * @method         indexOf 1:0
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
	 * @method         _bunchSiblings 2:0
	 * @private
	 * @param          {Node}          node        [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @param          {Node}          root        [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @param          {Function}      operation   this single argument function is to be applied on each ancestor of
	 *                                             `node` until `root` is reached.
	 * @return         {Array}
	 * @since          0.0.8
	 */
	var _bunchSiblings = function(node, root, operation){
	    var linkElem = [],
	        elem = node,
	        siblings;
	    while (!root.isEqualNode(elem)){
	        siblings = operation(elem);
	        linkElem = linkElem.concat(siblings);
	        elem = elem.parentNode;
	    }
	    return linkElem;
	};

	/**
	 * Returns an array of [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instances that
	 * come after `node` in the context of `root`.
	 *
	 * Therefore, all linkElem array elements belong to `root` while neither
	 * `root` nor `node` is included.
	 * @method         bunchNextSiblings 1:0
	 * @param          {Node}         node         a [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance,
	 *                                             must be inside of `node`
	 * @param          {Node}         root         a [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @return         {Array}                     array of [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instances
	 */
	this.bunchNextSiblings = function(node, root){
	    if (!((node instanceof Node) && (root instanceof Node) && this.contains(root, node)) ){
	        return;
	    }
	    return _bunchSiblings(node, root, this.nextSiblings);
	};

	/**
	 * Returns an array of [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instances that
	 * come before `node` in the context of `root`.
	 *
	 * Therefore, all linkElem array elements belong to `root` while neither
	 * `root` nor `node` is included.
	 * @method         bunchPrevSiblings 1:0
	 * @param          {Node}         node         a [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance,
	 *                                             must be inside of `node`
	 * @param          {Node}         root         a [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @return         {Array}                     array of [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instances
	 */
	this.bunchPrevSiblings = function(node, root){
	    if (!((node instanceof Node) && (root instanceof Node) && this.contains(root, node)) ){
	        return;
	    }
	    return _bunchSiblings(node, root, this.prevSiblings);
	};

	/**
	 * Returns array of elements that are obtained by always following direction `dir`.
	 *
	 * Starting from node `n`, the method applies property `dir` to it, until non-Node instance is
	 * reached. Array of all intermediate elements are then returned.
	 *
	 * ** Attention to infinite loops! **
	 * @method         _trackWalk 1:0
	 * @private
	 * @param          {Any}           elem
	 * @param          {String}        prop       property name to be applied
	 * @return         {Array}
	 * @since          0.0.8
	 *
	 */
	var _trackWalk = function(elem, dir){
	    var accum = [],
	        currentNode = elem[dir];
	    while (currentNode){
	        accum.push(currentNode);
	        currentNode = currentNode[dir];
	    }
	    return accum;
	};

	/**
	 * Returns `true` if node `asc` contains node `desc` among its descendants.
	 *
	 * This method is written for compatibility with IE that does not have method
	 * "contains" for Node instances.
	 * @method         contains 8:0
	 * @param          {Node}          asc
	 * @param          {Node}          desc
	 * @return         {Boolean}
	 * @since          0.0.8
	 */
	this.contains = function(asc, desc){
	    if (!((asc instanceof Node) && (desc instanceof Node))){
	        throw new Error('Both arguments must be Node instances!');
	    }
	    var n = desc;
	    while (n){
	        if (n === asc){ // node.isEqualNode(asc) --- not good, as it compares by value
	            return true;
	        }
	        n = n.parentNode;
	    }
	    return false;
	};


	/**
	 * Returns an array of elements that are next siblings of the given one.
	 *
	 * The first next sibling becomes the first element of the array,
	 * the second next sibling becomes the second one and so on.
	 * @method         nextSiblings 1:0
	 * @param          {Node}     elem     [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @return         {Array}             array of [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instances
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
	 * @method         prevSiblings 1:0
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
	 * Returns `true` if the argument is a [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text) instance.
	 * @method         isTextNode 2:0
	 * @param          {Any}           n
	 * @return         {Boolean}
	 * @since          0.0.8
	 */
	this.isTextNode = function(n){
	    return ((n instanceof Node) && (n.nodeType === Node.TEXT_NODE));
	};


	/**
	 * Returns array of first and last selected nodes of the range.
	 * Modifies DOM in case if boundary containers are selected partially.
	 *
	 * If the range's start or end container is a [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text),
	 * [Comment](https://developer.mozilla.org/en-US/docs/Web/API/Comment) or
	 * [CDATASection](https://developer.mozilla.org/en-US/docs/Web/API/CDATASection) then DOM is modified
	 * by cutting the container according to the range offsets.
	 * @method         detachBoundaries  1:0
	 * @param          {Range}         r
	 * @return         {Array}         array of [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @since          0.0.8
	 */
	this.detachBoundaries = function(r){
	    if (!(r instanceof Range)){
	        throw new Error('The argument must be a Range instance!');
	    }
	    if (r.collapsed){
	    	return [];
	    }
	    var sC = r.startContainer,
	        eC = r.endContainer,
	        sOff = r.startOffset,
	        eOff = r.endOffset,
	        isSameC = sC === eC,
	        boundaryNodes = [];
	    if (this.isTextNode(sC)){
	        if (isSameC){
	            this.spliceText(sC, [sOff, eOff]);
	        } else {
	            this.spliceText(sC, [sOff]);
	        }
	        boundaryNodes.push(sC.nextSibling);
	    }
	    else {
	        boundaryNodes.push(sC.childNodes[sOff]);
	    }
	    if (this.isTextNode(eC)){
	        if (!isSameC){
	            this.spliceText(eC, [eOff]);
	            boundaryNodes.push(eC);
	        }
	    } else {
	        boundaryNodes.push(eC.childNodes[eOff - 1]);
	    }
	    return boundaryNodes;
	};

	/**
	 * <style>
	 * .cut {color: red; font-weight: bold}
	 * </style>
	 * Splices text node `t` in non-empty text nodes according to the cuts given by array `breakpoints`.
	 * It is returned an array of text nodes that are inserted in the DOM due to splicing.
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
	 * @method         spliceText 3:0
	 * @param          {Text}          t              [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text) instance
	 * @param          {Array}         breakpoints    Array of integers in increasing order
	 * @return         {Array|Null}                   Array of [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text) instances
	 */
	this.spliceText = function(t, bP){
	    if (!(t instanceof Text) || !Array.isArray(bP)){
	        return;
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
	 * Returns array of nodes that belong to [Range](http://https://developer.mozilla.org/en-US/docs/Web/API/Range) instance `r`.
	 * @method         nodesOfRange 10:0
	 * @param          {Range}         r         [Range](http://https://developer.mozilla.org/en-US/docs/Web/API/Range) instance
	 * @return         {Array}
	 * @since          0.1.0
	 * @throws         {Error}         If `r` is not a [Range](http://https://developer.mozilla.org/en-US/docs/Web/API/Range) instance
	 */
	this.nodesOfRange = function(r){
		if (!(r instanceof Range)){
			throw new Error('The argument must be a Range instance!');
		}
		if (r.collapsed){
			return [];
		}
		var boundaries = this.detachBoundaries(r);
		if (boundaries.length === 0){
			return [];
		}
		if (boundaries.length === 1){
			return [boundaries[0]];
		}

		return this.nodesBetween(boundaries[0], boundaries[1]);
	};



	/**
	 * Applies `callback` to each element of array `block` until `callback` evaluates to anything
	 * that casts to `true`. Namely that result of `callback` is returned.
	 *
	 * @method         findInBlock 0:0
	 * @param          {Array}         block            array of anything
	 * @param          {Function}      callback
	 * @return         {Element|Null}
	 * @since          0.1.0
	 */
	this.findInBlock = function(block, callback){
		if (block === undefined || callback === undefined || !(Array.isArray(block)) || typeof callback !== 'function'){
			return;
		}
		var len = block.length,
	    	i, result;
	    for (i = 0; i < len; i++){
	    	try {
	    		result = callback(block[i]);
		        if (result){
	        	    return result;
		        }
	    	} catch (e){
	    		console.log(e.name + ' when applying callback to the element number ' + i + ' out of ' + len + ': ' + e.message);
	    	}
	    }
	    return null;
	};



	/**
	 * Returns **proxy** node of `n`:
	 * <ol><li>
	 * if `n` is a text element without siblings, then proxy of `n` is its parent node,
	 * </li><li>
	 * if `n` is a text element with siblings or is a node element, then proxy of `n` is `n` itself.
	 * </li></ol>
	 * @method         proxy  1:0
	 * @param          {Node}              n          [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @return         {Node|Null}
	 */
	this.proxy = function(n){
	    if (!(n instanceof Node)){
	        return null;
	    }
	    if (n instanceof Element){
	        return n;
	    }
	    return (n.nextSibling || n.previousSibling) ? n : n.parentNode;
	};

	/**
	 * Looks for a value of style property `key` of nearest ancestor of `node` in the scope of node `scope`.
	 * If the property is found, its value is returned, otherwise,  `undefined` is returned.
	 *
	 * Limit node `scope` is supposed to contain `node`. Otherwise, the search for the property
	 * is performed up to the "highest" parent of `node`.
	 *
	 * NB: ** optimize algorithm in such a way that DOM is parsed only once even when `scope` is set wrong. **
	 * @method         getInheritedStyleProp 3:0
	 * @param          {String}             key       name of property to find among inline style of ancestors
	 * @param          {Node}               node      [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @param          {Node}               scope     [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @return         {String|Number|Null}
	 * @since          0.0.4
	 */
	this.getInheritedStyleProp = function(key, node, scope){
		if (node === undefined){
			throw new Error("Starting node must be defined!");
		}
		var stl,
			currentNode = node;
		var unLimited = scope === undefined || !scope.contains(node);
		if (unLimited){
			while (currentNode)	{
				if (typeof currentNode.getAttribute === 'function'){
					stl = new Properties(currentNode.getAttribute('style'));
					if (stl.hasProperty(key)){
						return stl.getProperty(key);
					}
				}
				currentNode = currentNode.parentNode;
			}
		}
		if (!unLimited){
			while (currentNode && scope.contains(currentNode)){
				if (typeof currentNode.getAttribute === 'function'){
					stl = new Properties(currentNode.getAttribute('style'));
					if (stl.hasProperty(key)){
						return stl.getProperty(key);
					}
				}
				currentNode = currentNode.parentNode;
			}
		}

	};

	/**
	 * Returns the nearest node from which `node` inherits in-line style property `key`. If no such node exists, returns `undefined`.
	 * @method         getMentor 2:0
	 * @param          {String}             key               name of in-line style property
	 * @param          {Node}               node              [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @return         {Node|undefined}                       [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 */
	this.getMentor = function(key, node){
		var currentNode = node,
			stl;
		// if the scope is not defined or if it is erroneous, impose scope to be the root.
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
	 * Gets in-line style property with name `key` of `node`. Returns `undefined` if `node`
	 * does not have in-line style property `key`.
	 * @method         getStyleProperty 0:0
	 * @param          {Node}               node          [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @param          {String}             key           name of in-line style property of `node`
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
	 * Drops in-line style property `key` from `node` and removes in-line style attribute if
	 * it becomes empty.
	 *
	 * @method         dropStyleProperty 0:0
	 * @param          {Node}               node      [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @param          {String}             key       name of in-line style attribute to drop
	 * @return         {void}
	 */
	this.dropStyleProperty = function(node, key){
		if (!(node instanceof Node) || (typeof key !== 'string') || (!node.style)){
			return;
		}
		node.style.removeProperty(key);
		var attrName = 'style',
			attrValue = node.getAttribute(attrName);
		if (attrValue === ''){
			node.removeAttribute(attrName);
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
	 * @method         toggleElementStyle 0:0
	 * @param          {Element}            elem       [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) instance
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
			stl.setMode(Properties.MODE_STYLE);
			stl.setProperty(key, (styleValue === primary) ? secondary :  primary);
			elem.setAttribute(attrName, stl.toString());
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
	 * @method         complementNodes 1:0
	 * @param          {Node}               startNode          a [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)
	 *                                                         instance from which to start the path
	 * @param          {Node}               endNode            a [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)
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
	 * Inserts node `n` into `host` at position `offset`.
	 *
	 * The functionality is delegated to {{#crossLink "Document/insertIntoText:method"}}insertIntoText(){{/crossLink}}
	 * method if `host` is a [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text) instance,
	 * otherwise - to {{#crossLink "Document/insertChild:method"}}insertChild(){{/crossLink}} method.
	 * @method         insertAt 2:3
	 * @param          {Node}       host            [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)
	 *                                              instance in which `n` is to be inserted
	 * @param          {Node}       n               [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)
	 *                                              instance to be inserted
	 * @param          {Integer}       offset       Location of the cut into which node `n` is to be inserted
	 * @return         {void}
	 * @since          0.1.0
	 */
	this.insertAt = function(host, n, offset){
		if (!(host instanceof Node)){
			return;
		}
		if (host.nodeType === Node.TEXT_NODE){
			this.insertIntoText(host, n, offset);
		} else {
			this.insertChild(host, n, offset);
		}
	};

	/**
	 * Updates `node` according to `template`.
	 *
	 * `node`'s properties that are present in `template` get updated, while the others remain
	 * unchanged.
	 * @method         updateNode 0:1
	 * @param          {Node}           node         [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)
	 *                                               instance in which `n` is to be inserted
	 * @param          {Object}         template
	 * @return         {void}
	 * @since          0.2.1
	 */
	this.updateNode = function(node, template){
		/// !!! stub
		console.log('updating ', node, 'by template', template);
	};

	/**
	 * Returns available width for an element in case it is inserted as a child of `el`.
	 *
	 * The method tries to calculate a width that can be assigned to an element based on width
	 * of `el` or its ascendants.
	 *
	 * If neither `el` nor its ascendant have width style property set, then nothing is returned.
	 *
	 * @method         getAvailableWidth 0:1
	 * @param          {Element}       el     [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)
	 *                                        instance to be inserted
	 * @return         {String|Number|void}
	 * @since          0.2.1
	 */
	this.getAvailableWidth = function(el){
		var propName = 'width',
			mentor = this.getMentor(propName, el);
		if (mentor){
			return mentor.style[propName];
		}
	};

	/**
	 * Inserts node `n` as a child of `hostNode` at the position `offset`.
	 * @method         insertChild 1:0
	 * @param          {Element}       hostNode
	 * @param          {Node}          n
	 * @param          {Integer}       offset
	 * @return         {void}
	 * @since          0.1.0
	 */
	this.insertChild = function(hostNode, n, offset){
		var children = hostNode.childNodes;
		var rightNode;
		if (offset > children.length){
			console.log(offset, children.length);
			throw new Error('offset is too big!');
		}
		if (offset === children.length){
			hostNode.appendChild(n);
		} else {
			rightNode = children[offset];
			if (!rightNode){
				throw new Error('Wrong offset to insert node at!');
			}
			hostNode.insertBefore(n, rightNode);
		}
	};

	/**
	 * Inserts `elem` inside `textElem` at the position `pos`.
	 * @method         insertIntoText 1:0
	 * @param          {Text}          textElement    [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text) instance
	 * @param          {Element}       elem           [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) instance
	 * @param          {Integer}       offset
	 * @since          0.2.1
	 */
	this.insertIntoText = function(textElem, elem, offset){
		if (elem instanceof Text){
			var text1 = textElem.nodeValue,
				text2 = elem.nodeValue,
				text;
			text = text1.slice(0, offset) + text2 + text1.slice(offset);
			textElem.nodeValue = text;
			return textElem;
		}
		// textElem is NOT a text node
		if (offset === 0){
			/// insert at the beginning (no need to split the node)
			textElem.parentNode.insertBefore(elem, textElem);
		} else {
			var rightNode, len;
			len = textElem.nodeValue.length;
			/// insert in the middle
			if (offset < len){
				rightNode = textElem.splitText(offset);
				textElem.parentNode.insertBefore(elem, rightNode);
			}
			/// insert in the end (no need to split the node)
			if (offset === len){
				rightNode = textElem.nextSibling;
				if (rightNode){
					textElem.parentNode.insertBefore(elem, rightNode);
				} else {
					textElem.parentNode.appendChild(elem);
				}
			}
		}
	};



	/**
	 * Inserts many lists of type  `listType` into `content`. Items of each list are made of nodes corresponding
	 * to elements of array `selection`.
	 *
	 * @method         selectionToList 0:1
	 * @param          {Array}         selection       array of [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instances
	 * @param          {String}        listType     type of list (ordered or unordered) to be inserted
	 * @return         {void}
	 * @since          0.1.0
	 */
	this.selectionToList = function(selection, listType){
		if (!(Array.isArray(selection))) {
			return;
		}
		selection.forEach(function(range){
			this.rangeToList(range, listType);
		}.bind(this));
	};


	/**
	 * Converts `range` into a list of type `listType`.
	 *
	 * Each node of the range becomes an item of the list.
	 * @method         rangeToList 1:0
	 * @param          {Range}       range
	 * @param          {String}      type      list type (i.e. ol, ul)
	 * @return         {void}
	 * @since          0.2.5
	 */
	this.rangeToList = function(range, type){
		var factory = this.getFactory();
		if (!factory){
			return;
		}
		var list = new List(type),
			host = range.startContainer,
			offset = range.startOffset;

		var nodes = this.nodesOfRange(range);
		var items = [];
		if (nodes){
			nodes.forEach(function(node){
				try {
					var elem = factory.mimic(node);
					items.push(elem);
					this.removeNode(node);
				} catch (e){
					console.log(e.name + ' occurred when creating list item: ' + e.message);
				}
			}.bind(this));
		}
		items.push('');
		list.appendAsItems(items);
		this.insertAt(host, list.toNode(), offset);
	};




	/**
	 * Sets type of list node to be `newType`.
	 *
	 * `node` is supposed to be a tag corresponding to a list.
	 *
	 * @method         setListNodeType 0:1
	 * @param          {Node}          node
	 * @param          {String}        newType
	 * @return         {Boolean}
	 * @since          0.2.0
	 */
	this.setListNodeType = function(node, newType){
		try {
			var listElem = this.getFactory().mimic(node),
				parent;
			if (!(listElem instanceof List)){
				return false;
			}
			listElem.switchName(newType);
			parent = node.parentNode;
			parent.replaceChild(listElem.toNode(), node);
			return true;
		} catch(e){
			console.log('Error (' + e.name + ') when switching a list type: ' + e.message);
			return false;
		}
	};


	/**
	 * Converts selection given by `ranges` into a bold font.
	 * @method         convertToBold  0:1
	 * @param          {Array}         ranges    array of [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instances
	 * @return         {void}
	 * @since          0.1.0
	 */
	this.convertToBold = function(ranges){
		this.updateRangesStyleProp(ranges, 'font-weight', 'bold');
	};

	/**
	 * Converts selection given by `ranges` into italic font style.
	 * @method         convertToItalics 0:1
	 * @param          {Array}         ranges    array of [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instances
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.convertToItalics = function(ranges){
		this.updateRangesStyleProp(ranges, 'font-style', 'italic');
	};

	/**
	 * Converts selection given by `ranges` into stroked style.
	 * @method         convertToStroked 0:1
	 * @param          {Array}         ranges    array of [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instances
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.convertToStroked = function(ranges){
		this.updateRangesStyleProp(ranges, 'text-decoration', 'line-through');
	};

	/**
	 * Converts selection given by `ranges` into underlined style.
	 * @method         convertToUnderlined 0:1
	 * @param          {Array}         ranges    array of [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instances
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.convertToUnderlined = function(ranges){
		this.updateRangesStyleProp(ranges, 'text-decoration', 'underline');
	};


	/**
	 * Updates style property `stlName` of each element of array `ranges` to become equal to `stlValue`.
	 * @method         updateRangesStyleProp 4:0
	 * @param          {Array}         ranges        array of [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instances
	 * @param          {String}        stlName       name of style property which value is subject to update
	 * @param          {Any}           stlValue      value of the style property
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.updateRangesStyleProp = function(ranges, stlName, stlValue){
		if (!Array.isArray(ranges)){
			return;
		}
		ranges.forEach(function(range){
			this.modifyRangeStyleProperty(range, stlName, stlValue);
		}.bind(this));

	};


	/**
	 * Highlights selection by setting style property `key` of the selection specified by `range` to be equal to `value`.
	 * @method         modifyRangeStyleProperty 1:0
	 * @param          {Range}         range [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instance
	 * @param          {String}        key
	 * @param          {String}        value
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.modifyRangeStyleProperty = function(range, key, value){
		var nodes;
		try {
			nodes = this.nodesOfRange(range);
		} catch (e){
			console.log('Error (' + e.name + ') when retrieving nodes of the range: ' + e.message);
			return;
		}
		this.accentuateNodesStyleProperty(nodes, key, value);
	};


	/**
	 * Sets style property `key` of array `nodes` of [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instances
	 * to be equal to `value`.
	 *
	 * The operation is performed by means of method
	 * {{#crossLink "Document/accentuateSingleNodeStyleProperty:method"}}accentuateSingleNodeStyleProperty{{/crossLink}}
	 * that is called using every element of array `nodes`.
	 *
	 * @method        accentuateNodesStyleProperty 1:0
	 * @param         {Array}          nodes         array of [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instances
	 * @param         {String|Number}  key           name of style property
	 * @param         {String|Number}  value         value of the style property
	 * @return        {void}
	 * @throws        {Error}                        If `nodes` is not an array
	 * @since         0.2.0
	 */
	this.accentuateNodesStyleProperty = function(nodes, key, value){
		if (!Array.isArray(nodes)){
			throw new Error('Set of nodes must be given as an array!');
		}
		nodes.forEach(function(node){
			if (node instanceof Node){
				this.accentuateSingleNodeStyleProperty(node, key, value);
			}
		}.bind(this));

	};

	/**
	 * Sets `node`'s style property `key` to be equal to `value`.
	 * <ol><li>
	 * If there exists a node from which the given node inherits a value V of the style property
	 * `key` (that node is called {{#crossLink "Document/getMentor:method"}}mentor{{/crossLink}}
	 * and might coincide with the original node) such that V is different from `value`, then
	 * <ol><li>
	 * value V is suggested for all {{#crossLink "Document/complementNodes:method"}}complement nodes{{/crossLink}}
	 * as a value of their style property `key`
	 * </li><li>
	 * the mentor gets rid of the style property `key`
	 * </li><li>
	 * style property `key` of a {{#crossLink "Document/proxy:method"}}proxy{{/crossLink}} of the given
	 * node is set to the requested value
	 * </li></ol>
	 * </li><li>If the mentor does not exist, then style property `key` of a
	 * {{#crossLink "Document/proxy:method"}}proxy{{/crossLink}} of the given
	 * node is set to the requested value</li></ol>
	 * @method         accentuateSingleNodeStyleProperty 1:0
	 * @param          {Node}          node    [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @param          {String}        key     name of style property
	 * @param          {Any}           value   value of the style property
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.accentuateSingleNodeStyleProperty = function(node, key, value){
		var mentor = this.getMentor(key, node);
		if (mentor instanceof Element){
			var actualValue = this.getStyleProperty(mentor, key);
			if (actualValue === value){
				return;
			}
			/// removes the property from the mentor
			this.dropStyleProperty(mentor, key);
			/// suggest original property to all complementary nodes
			var complementNodes = this.complementNodes(mentor, node);
			complementNodes.forEach(function(n){
				this.suggestStyleProperty(n, key, actualValue);
			}.bind(this));

		}
		/// set property of node's proxy
		var proxy = this.proxy(node);
		this.setStyleProperty(proxy, key, value);
	};


	/**
	 * Sets style property `key` of `node` to be equal to `value`.
	 *
	 * If `node` is an [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) instance, then it is
	 * set the required value of the style property.
	 * Otherwise, the node is replaced by a span element to which the node is appended. Required style property is
	 * then assigned to the newly created span element.
	 *
	 * @method         setStyleProperty 2:0
	 * @param          {Node}              node   [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @param          {String}            key
	 * @param          {String|Number}     value
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.setStyleProperty = function(node, key, value){
		if (!(node instanceof Node) || (typeof key !== 'string') || (key === '') ){
			return;
		}
		if (((typeof value !== 'string') && (typeof value !== 'number')) || (value === '')){
			return;
		}
		var target, stl;
		if (node instanceof Element){
			target = node;
		} else {
			// insert a node between node and its parent
			// in order to change its styles
			var parent = node.parentNode,
				span = document.createElement('span');
			parent.insertBefore(span, node);
			span.appendChild(node);
			target = span;
		}
		stl = new Properties(target.getAttribute('style'));
		stl.setMode(Properties.MODE_STYLE);
		stl.setProperty(key, value);
		target.setAttribute('style', stl.toString());
	};

	/**
	 * Sets style property `key` of `node` to be equal to `value` only if the node does not
	 * contain that property among its style ones.
	 * @method         suggestStyleProperty 1:0
	 * @param          {Node}          node        [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @param          {String}        key
	 * @param          {Any}           value
	 * @return         {void}
	 * @throws         {Error}         If `node` is not a [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @since          0.2.0
	 */
	this.suggestStyleProperty = function(node, key, value){
		if (!(node instanceof Node)){
			throw new Error('It is illegal to suggest a property to a non-Node instance!');
		}
		if (node.getAttribute){
			var styleStr = node.getAttribute('style'),
				styleObj = new Properties(styleStr);
			if (styleObj.hasProperty(key)){
				return;
			}
		}
		this.setStyleProperty(node, key, value);
	};

	/**
	 * Returns common style (may be inherited from ancestors) of multiple nodes.
	 *
	 * If `nodes` have no common style property `key`, `undefined` is returned.
	 * @method         commonStyleProperty 0:0
	 * @param          {Array}         nodes     Array of [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instances
	 * @param          {String|Number} key
	 * @return         {String|Number|undefined}
	 * @since          0.2.0
	 */
	this.commonStyleProperty = function(nodes, key){
		if (!Array.isArray(nodes) || nodes.length === 0){
			return undefined;
		}
		var len = nodes.length,
			value = this.getInheritedStyleProp(key, nodes[0]),
			valueTmp,
			i;
		for(i = 1; i < len; i++){
			valueTmp = this.getInheritedStyleProp(key, nodes[i]);
			if (valueTmp !== value){
				return undefined;
			}
		}
		return value;
	};

	/**
	 * Whether `n` is an [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) instance corresponding to an image.
	 * @method         isImage 1:0
	 * @param          {Any}     n
	 * @return         {Boolean}
	 * @since          0.2.0
	 */
	this.isImage = function(n){
		return (n instanceof Element) && (n.tagName.toLowerCase() === 'img');
	};

	/**
	 * Whether `n` is an [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) instance corresponding to a link.
	 * @method         isLink 2:0
	 * @param          {Any}     n
	 * @return         {Boolean}
	 * @since          0.2.0
	 */
	this.isLink = function(n){
		return (n instanceof Element) && (n.tagName.toLowerCase() === 'a');
	};

	/**
	 * Whether `n` is an [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) instance corresponding to a table.
	 * @method         isTable 1:0
	 * @param          {Any}     n
	 * @return         {Boolean}
	 * @since          0.2.0
	 */
	this.isTable = function(n){
		return (n instanceof Element) && (n.tagName.toLowerCase() === 'table');
	};


	/**
	 * Removes image elements from each element of array `ranges`.
	 * @method         clearRangesFromImages 0:0
	 * @param          {Array}         ranges
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.clearRangesFromImages = function(ranges){
		this.applyToDesOfManyRanges(ranges, this.isImage, this.removeNode, true);
	};

	/**
	 * Applies `operation` on the descendats of nodes belonging to `ranges` on which `filter` evaluates to `true`.
	 *
	 * Calls method {{#crossLink "Document/applyToDesOfSingleRange:method"}}applyToDesOfSingleRange{{/crossLink}} on each
	 * element of array `ranges`, passing to that method the range, `filter` and `operation`.
	 *
	 * @method         applyToDesOfManyRanges 1:0
	 * @param          {Array}         ranges                array of [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range)
	 *                                                       instances. Non Range instances are ignored.
	 * @param          {Function}      filter                [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) -> Boolean
	 * @param          {Function}      operation             [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) -> void
	 * @param          {Boolean}       mode                  [Optional] whether the execution should be terminated after applying
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.applyToDesOfManyRanges = function(ranges, filter, operation, mode){
		ranges.forEach(function(range){
			if(range instanceof Range){
				this.applyToDesOfSingleRange(range, filter, operation, mode);
			}
		}.bind(this));
	};

	/**
	 * Removes link elements from each element of array `ranges`.
	 *
	 * Alias for {{#crossLink "Document/applyToAncOfManyRanges:method"}}applyToAncOfManyRanges{{/crossLink}}
	 * with second and third arguments being correspondingly {{#crossLink "Document/isLink:method"}}isLink{{/crossLink}} and
	 * {{#crossLink "Document/deparentize:method"}}deparentize{{/crossLink}}.
	 * @method         clearRangesFromLinks 0:0
	 * @param          {Array}         ranges    array of [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instances
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.clearRangesFromLinks = function(ranges){
		this.applyToAncOfManyRanges(ranges, this.isLink, this.deparentize);
	};


	/**
	 * Removes table elements from each element of array `ranges`.
	 *
	 * Alias for {{#crossLink "Document/applyToAncOfManyRanges:method"}}applyToAncOfManyRanges{{/crossLink}}
	 * with second and third arguments being correspondingly {{#crossLink "Document/isTable:method"}}isTable{{/crossLink}} and
	 * {{#crossLink "Document/removeNode:method"}}removeNode{{/crossLink}}.
	 * @method         clearRangesFromTables 0:1
	 * @param          {Array}         ranges    array of [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instances
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.clearRangesFromTables = function(ranges){
		this.applyToAncOfManyRanges(ranges, this.isTable, this.removeNode, true);
	};

    /**
     * Applies `operation` on the nearest ancestors of nodes belonging to `ranges` on which `filter` evaluates to `true`.
     *
     * Calls method {{#crossLink "Document/applyToAncOfSingleRange:method"}}applyToAncOfSingleRange{{/crossLink}} on each
     * element of array `ranges`, passing to that method the range, `filter` and `operation`.
     *
     * @method         applyToAncOfManyRanges 2:0
     * @param          {Array}         ranges    array of [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instances.
     *                                           Non Range instances are ignored.
     * @param          {Function}      filter    [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) -> Boolean
     * @param          {Function}      operation [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) -> void
     * @return         {void}
     * @since          0.2.0
     */
    this.applyToAncOfManyRanges = function(ranges, filter, operation){
    	ranges.forEach(function(range){
    		if(range instanceof Range){
    			this.applyToAncOfSingleRange(range, filter, operation);
    		}
    	}.bind(this));
    };

	/**
	 * Applies `operation` to all nodes that are ancestors of nodes belonging `range` and for which
	 * `criteria` evaluates to `true`.
	 * @method         applyToAncOfSingleRange 1:0
	 * @param          {Range}         range       [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instance
	 * @param          {Function}      criteria    [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) -> Boolean
	 * @param          {Function}      operation   [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) -> void
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.applyToAncOfSingleRange = function(range, criteria, operation){
		var nodes = range.collapsed ? [range.startContainer] : this.nodesOfRange(range);
		var targets = this.findAncestorsOfMany(nodes, criteria);
		targets.forEach(function(n){
			try {
				operation(n);
			} catch(e){
				return;
			}
		}.bind(this));
	};

	/**
	 * Removes node `n` from DOM maintaining its child nodes (if any).
	 * @method         deparentize 2:0
	 * @param          {Node}          n         [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.deparentize = function(n){
		var parent = n.parentNode;
		if (!parent){
			return;
		}
		if (n instanceof Element){
			var i,
				len = n.childNodes.length;
			for (i = 0; i < len; i++){
				// childNodes is a live collection, therefore the child to move has always index 0
				parent.insertBefore(n.childNodes[0], n);
			}
		}
		this.removeNode(n);
	};



	/**
	 * Applies method {{#crossLink "Document/applyToDesOfSingleNode:property"}}applyToDesOfSingleNode{{/crossLink}}
	 * on each node of belonging to `range`
	 * @method         applyToDesOfSingleRange 1:0
	 * @param          {Range}         range
	 * @param          {Function}      criteria                [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) -> Boolean
	 * @param          {Function}      operation               [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) -> void
	 * @param          {Boolean}       mode                    [Optional] whether the execution should be terminated after applying
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.applyToDesOfSingleRange = function(range, criteria, operation, mode){
		var nodes = this.nodesOfRange(range);
		nodes.forEach(function(n){
			this.applyToDesOfSingleNode(n, criteria, operation, mode);
		}.bind(this));
	};

	/**
	 * Applies `operation` to `node` descendants for which `criteria` evaluates to `true`.
	 *
	 * The flow is as follows: <ol><li>
	 * apply `criteria` to `node` itself and if it evaluates to `true`, then: <ol><li>
	 * apply `operation` on `node`
	 * </li><li>
	 * if `mode              ` is set to `true`, then finish the execution.
	 * </li></ol>
	 * </li>
	 * repeat the procedure to each `node`'s child.
	 * </li></ol>
	 *
	 * @method         applyToDesOfSingleNode 2:0
	 * @param          {Node}          node
	 * @param          {Function}      criteria 			   [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) -> Boolean
	 * @param          {Function}      operation               [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) -> void
	 * @param          {Boolean}       mode                    [Optional] whether the execution should be terminated after applying
	 *                                                         of the operation. Default value is `true`.
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.applyToDesOfSingleNode = function(node, criteria, operation, mode){
		var critOutput,
			shouldStop = mode === undefined ? true : mode;
		try{
			critOutput = criteria(node);
		} catch (e){
			console.log('Error (' + e.name + ') when applying criteria to a node: ' + e.message);
			critOutput = false;
		}
		if (critOutput){
			try {
				operation(node);
			} catch(e){
				console.log('Error (' + e.name + ') when applying operation to a node: ' + e.message);
			}
			if (shouldStop){
				return;
			}
		}
		var children = node.childNodes;
		var i,
			len = children.length;
		for (i = len - 1; i >= 0; i--){
			this.applyToDesOfSingleNode(children.item(i), criteria, operation, mode);
		}
	};

	/**
	 * Removes node `n` from DOM.
	 * @method         removeNode 4:1
	 * @param          {Node}        n
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.removeNode = function(n){
		var parent = n.parentNode;
		if (parent){
			parent.removeChild(n);
		}
	};

	/**
	 * Inserts empty column into `table` at position `pos`.
	 * @method         insertColumn 0:1
	 * @param          {Element}       table     [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)
	 *                                           instance representing table
	 * @param          {String}        pos       "after"|"before"
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.insertColumn = function(table, pos){
		/// !!! stub
		console.log(table, pos);
	};

	/**
	 * Finds all elements that satisfy the given `criteria`.
	 *
	 * The search is performed over ancestors of nodes belonging to `ranges`.
	 * @method         findAncestorsOfRanges 0:0
	 * @param          {Array}         ranges    array of ranges
	 * @param          {Function}      criteria  function: Node -> Boolean
	 * @return         {Array}                   array (might be empty) of Element instances
	 * @since          0.2.1
	 */
	this.findAncestorsOfRanges = function(ranges, criteria){
		var ancestorsGlob = [];
		ranges.forEach(function(range){
			var nodes = range.collapsed ? [range.startContainer] : this.nodesOfRange(range),
				ancestorsLoc = this.findAncestorsOfMany(nodes, criteria);
			ancestorsGlob = ancestorsGlob.concat(ancestorsLoc);
		}.bind(this));
		return ancestorsGlob;
	};

	/**
	 * Returns a first ancestor of elements belonging to the selection on which
	 * `criteria` evaluates to `true`. If no such element found, nothing is returned.
	 * @method         findSelectionFirstAncestor 0:1
	 * @param          {Array}         ranges         array of ranges
	 * @param          {Function}      criteria       function: Node -> Boolean
	 * @return         {Node|null}
	 * @since          0.2.1
	 */
	this.findSelectionFirstAncestor = function(selection, criteria){
		var len = selection.length,
			needle,
			i;
		for (i = 0; i < len; i++){
			needle = this.findRangeFirstAncestor(selection[i], criteria);
			if (needle){
				return needle;
			}
		}
	};


	/**
	 * Returns first ancestor of elements of range on which `criteria` evaluates to `true`.
	 * If no such element found, nothing is returned.
	 * @method         findRangeFirstAncestor 0:1
	 * @param          {Range}         range     [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instance
	 * @param          {Function}      criteria  function: Node -> Boolean
	 * @return         {Node|null}
	 * @since          0.2.1
	 */
	this.findRangeFirstAncestor = function(range, criteria){
		if (range.collapsed){
			return this.findAncestor(range.startContainer, criteria);
		}
		var nodes = this.nodesOfRange(range),
			len = nodes.length,
			i, ancestor;
		for (i = 0; i < len; i++){
			ancestor = this.findAncestor(nodes[i], criteria);
			if (ancestor){
				return ancestor;
			}
		}
	};


	/**
	 * Returns text representation of the selection given by `ranges`.
	 *
	 * @method    selectionToString 0:1
	 * @param     {Array}     ranges                  array of [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instances
	 * @param     {String}    separator               [Optional] string to be used as a separator between ranges
	 * @return    {String}
	 */
	this.selectionToString = function(ranges, separator){
		var stringBunch = [];
		ranges.forEach(function(range){
			stringBunch.push(range.toString());
		});

		return stringBunch.join(separator || '');
	};

	/**
	 * Creates a [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance whose properties are
	 * encoded in `template`.
	 *
	 * Delegates its functionality to {{#crossLink "Factory/createFromTemplate:method"}}createFromTemplate{{/crossLink}}
	 * of {{#crossLink "Factory"}}Factory{{/crossLink}} class.
	 *
	 * @method         createFromTemplate 0:2
	 * @param          {Object}        template
	 * @return         {Node}
	 * @since          0.2.1
	 */
	this.createFromTemplate = function(template){
		try {
			return this.getFactory().createFromTemplate(template);
		} catch(e){
			console.log(e.name + ' occurred when delegating creation of a node from template: ' + e.message);
		}
	};

	/**
	 * Returns a new [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) instance which is obtained
	 * by appending nodes of `ranges` to `element`.
	 * @method         moveNodesToLink 0:0
	 * @param          {Element}       element       [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) instance
	 * @param          {Array}         ranges        array of [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instances
	 * @return         {Element}
	 * @since          0.2.1
	 */
	this.moveNodesToLink = function(element, ranges){
		ranges.forEach(function(range){
			var nodes = this.nodesOfRange(range);
			if (!Array.isArray(nodes)){
				return;
			}
			nodes.forEach(function(node){
				element.appendChild(node);
			});
		}.bind(this));
		console.info("moveNodesToLink", element);
		return element;
	};


	/**
	 * Replaces `oldNode`  by `newNode`.
	 *
	 * Modifies DOM which `oldNode` belongs to in such a way that `oldNode` gets replaced by `newNode`.
	 *
	 * In fact, it is based on [replaceChild](https://developer.mozilla.org/en-US/docs/Web/API/Node/replaceChild) method of
	 * [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) class.
	 * @method         replaceChild 2:1
	 * @param          {Node}          newNode      [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @param          {Node}          oldNode      [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @return         {void}
	 * @since          0.2.1
	 */
	this.replaceChild = function(newNode, oldNode){
		var parent = oldNode.parentNode;
		if (parent){
			parent.replaceChild(newNode, oldNode);
		}
	};


	/**
	 * Returns `true` if node `n` is editable and `false` otherwise.
	 * A node is editable if one of the following holds: <ul><li>
	 * it is a [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text) instance
	 * </li><li>
	 * it has exactly one child that is a [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text) instance
	 * </li></ol>
	 * @method         isNodeEditable 1:2
	 * @param          {Node}          n           [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @return         {Boolean}
	 * @since          0.2.1
	 */
	this.isNodeEditable = function(n){
		try {
			return (n.nodeType === Node.TEXT_NODE) || ((n.childNodes.length === 1) && (n.firstChild.nodeType === Node.TEXT_NODE));
		} catch(e){
			return false;
		}


	};

	/**
	 * Returns `true` if the selection is editable.
	 *
	 * The selection is editable if corresponding array of [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range)
	 * instances only one element and that element is an editable [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instance.
	 * @method         isSelectionEditable 0:2
	 * @param          {Array}         ranges    array of [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instances
	 * @return         {Boolean}
	 * @since          0.2.1
	 */
	this.isSelectionEditable = function(ranges){
		if (ranges.length !== 1){
			return false;
		}
		return this.isRangeEditable(ranges[0]);
	};

	/**
	 * Returns `true` if range `r` corresponds to a part of DOM that can be edited.
	 * @method         isRangeEditable 1:0
	 * @param          {Range}         r    [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instance
	 * @return         {Boolean}
	 * @since          0.2.1
	 */
	this.isRangeEditable = function(r){
		if (!(r instanceof Range)){
			return false;
		}
		if (r.collapsed){
			return true;
		}
		var nodes = this.nodesOfRange(r);
		if (nodes.length > 1){
			return false;
		}
		return this.isNodeEditable(nodes[0]);
	};

	/**
	 * Modifies `link` using data present in `referenceLink`.
	 *
	 * @method         modifyLink 0:1
	 * @param          {Element}       link
	 * @param          {Element}       referenceLink      editor-specific representation of dialog window
	 * @return         {void}
	 * @since          0.2.1
	 */
	this.modifyLink = function(link, referenceLink){
		var attrs = referenceLink.attributes,
			attr,
			len = attrs.length,
			i;
		for (i = 0; i < len; i++){
			attr = attrs.item(i);
			if (attr){
				link.setAttribute(attr.name, attr.value);
			}
		}
		if (this.isNodeEditable(link)){
			link.innerHTML = referenceLink.innerHTML;
		}
	};

	/**
	 * Transforms nodes of `selection` into links based on information stored in `referenceLink`.
	 *
	 * This method is called in the case when there is no links among ancestors of the nodes
	 * belonging to the selection. Therefore, one should manage eventual presence of links
	 * among descendants of the nodes belonging to the selection.
	 *
	 * @method         selectionToLink 0:1
	 * @param          {Array}         selection      array of [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instances
	 * @param          {Element}       referenceLink
	 * @return         {void}
	 * @since          0.2.1
	 */
	this.selectionToLink = function(selection, referenceLink){
		console.log(selection, referenceLink);
		selection.forEach(function(range){
			this.rangeToLink(range, referenceLink);
		}.bind(this));
	};

	/**
	 * Transforms `range` into a link based on information stored in `referenceLink`.
	 *
	 * @method         rangeToLink 1:0
	 * @param          {Range}         range
	 * @param          {Element}       referenceLink
	 * @return         {void}
	 * @since          0.2.3
	 */
	this.rangeToLink = function(range, referenceLink){
		if (range.collapsed){
			this.insertAt(range.startContainer, referenceLink, range.startOffset);
		}
		var nodes = this.nodesOfRange(range);
		console.log(nodes);
		nodes.forEach(function(node){
			this.nodeToLink(node, referenceLink);
		}.bind(this));
	};

	/**
	 * Converts `node` into a link based on information stored in `referenceLink`.
 	 * The method must manage possible situation when there are links among descendants
	 * of the nodes belonging to the range.
	 * @method         nodeToLink 1:0
	 * @param          {Node}    node              [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instances
	 * @param          {Element} referenceLink     an element representing html hyperlink
	 * @return         {void}
	 * @since          0.2.3
	 */
	this.nodeToLink = function(node, referenceLink){
		console.log('nodeToLink', node, referenceLink);
		var parent = node.parentNode;
		if (!parent){
			return;
		}
		parent.insertBefore(referenceLink, node);
		referenceLink.appendChild(node);
		this.clearNodeFromLink(node);
	};

	/**
	 * Finds hyperlinks among descendants of node `n` and removes link wrapper (leaving the content).
	 * @method         clearNodeFromLink 1:0
	 * @param          {Node}          n
	 * @return         {void}
	 * @since          0.2.3
	 */
	this.clearNodeFromLink = function(n){
		this.applyToDesOfSingleNode(n, this.isLink, this.deparentize, true);
	};

	/**
	 * Replace selection by link.
	 *
	 * NB: Simple (not correct) version. It does not take care of multiple ranges (I do not
	 * know how they are relevant because the selection is supposed to be editable).
	 * @method         replaceSelectionByLink 0:1
	 * @param          {Array}         ranges
	 * @param          {Element}       referenceLinklink
	 * @return         {void}
	 * @since          0.2.3
	 */
	this.replaceSelectionByLink = function(ranges, referenceLink){
		var range = ranges[0];
		if (range.collapsed){
			this.insertAt(range.startContainer, referenceLink, range.startOffset);
			return;
		}
		var nodes = this.nodesOfRange(range),
			parent;
		if (nodes.length > 0){
			parent = nodes[0].parentNode;
			if (parent){
				parent.replaceChild(referenceLink, nodes[0]);
			}
		}
	};


}