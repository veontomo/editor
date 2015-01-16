/*jslint plusplus: true, white: true */
/*global Element, Text, Node, Properties, Tag, Helper, FACTORY, Unit, NEWSLETTER, Converter, Mapper, Range, Link */

/**
 * This class is to deal with document: parsing, converting, saving.
 *
 * @module 	    Document
 * @class  		Document
 * @param       {DOM.Node}          node          the content of the document
 * @since       0.0.5
 * @author      A.Shcherbakov
 * @uses        Unit              class to deal with numbers with unit of measurements
 * @uses        Properties        class to deal with Properties of document nodes
 */

function Document(node){
	"use strict";
	if (!(this instanceof Document)) {
		return new Document(node);
	}

	/**
	 * Instance of [DOM.Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) representing
	 * the content of the class instance.
	 * @private
	 * @property       {DOM.Node}           _content
	 * @type           {DOM.Node}
	 */
	var _content;


	/**
	 * (Optional) Styles to be applied to overall content of the newsletter before saving it.
	 *
	 * If set, it is supposed to be an instance of {{#crossLink "Properties"}}Properties{{/crossLink}}
	 * class with {{#crossLink "Properties/_mode:property"}}_mode{{/crossLink}} to be set to correspond
	 * to inline styles.
	 * @property       {Properties}    _wrapCss
	 * @private
	 * @since          0.0.6
	 */
	var _wrapCss;


	/**
	 * Instance of {{#crossLink "Converter"}}Converter{{/crossLink}}. Its responsability is to convert
	 * current instance into different formats.
	 * @property       {Converter}          _converter
	 * @default        Converter
	 * @private
	 */
	var _converter = new Converter(NEWSLETTER.formatMapper || (new Mapper()));

	/**
	 * Constructor.
	 *
	 * Sets {{#crossLink "Document/_content:property"}}_content{{/crossLink}} to be equal to `node`
	 * if it is an instance of [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)
	 * (in fact, it is enough that `node` has `typeNode` property).
	 * @method         constructor
	 * @param          {Node}           node
	 */
	if (node instanceof Node){
		_content = node;
	}

	/**
	 * {{#crossLink "Document/_converter:property"}}_converter{{/crossLink}} setter. Supposed to be an
	 * instance of {{#crossLink "Converter"}}Converter{{/crossLink}} though no validation control is
	 * performed.
	 * @method         setConverter
	 * @param          {Any}                c
	 * @return         {void}
	 */
	this.setConverter = function(c){
		_converter = c;
	};

	/**
	 * {{#crossLink "Document/_converter:property"}}_converter{{/crossLink}} getter.
	 * @method         getConverter
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
	 * @method         getFactory
	 * @return         {Object|null}
	 * @since          0.1.0
	 */
	this.getFactory = function(){
		return _factory;
	};

	/**
	 * {{#crossLink "Document/_factory:property"}}_factory{{/crossLink}} setter.
	 * @method         setFactory
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
	 * @method         setMapper
	 * @param          {void}               m
	 */
	this.setMapper = function(m){
		_converter.setMapper(m);
	};


	/**
	 * Returns "deep" [clone](https://developer.mozilla.org/en-US/docs/Web/API/Node.cloneNode) of
	 * {{#crossLink "Document/_content:property"}}_content{{/crossLink}}. If it is not set, nothing
	 * is returned.
	 * @method         getContent
	 * @return         {Node}
	 */
	this.getContent = function(){
		if (_content){
			return _content.cloneNode(true);
		}
	};

	/**
	 * {{#crossLink "Document/_content:property"}}_content{{/crossLink}} setter.
	 *
	 * If the argument is not a [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance, assignment is not performed.
	 * @method         setContent
	 * @param          {DOM.Node}           n
	 * @return         {void}
	 */
	this.setContent = function(n){
		if (n instanceof Node){
			_content = n;
		}
	};


	/**
	 * Removes attributes present in array `flies` of regular expressions from
	 * {{#crossLink "Document/_content:property"}}_content{{/crossLink}}
	 * It first creates a "shallow" (without children) copy of the argument and applies
	 * {{#crossLink "Document/cleanCurrent:method"}}cleanCurrent{{/crossLink}} method
	 * to remove attributes from the argument. Then, consider each child of the argument
	 * and applies {{#crossLink "Document/clean:method"}}clean{{/crossLink}} method to them
	 * and append the result to the shallow copy.
	 *
	 * @method         clean
	 * @param          {Array}      flies        array of regular expressions
	 * @return         {void}
	 */
	this.clean = function(flies){
		var n = this.getContent(),
			out = n.cloneNode(false);
		this.cleanRoot(out, flies);
		var children = n.childNodes,
			len = children.length,
			i, cleanChild, d;
		// parsing each child one by one
		for (i = 0; i < len; i++){
			d = new Document(children.item(i));
			d.clean(flies);
			cleanChild = d.getContent();
			out.appendChild(cleanChild);
		}
		this.setContent(out);
	};

	/**
	 * Escapes "tricky" symbols by their html code representations.
	 *
	 * After execution of this method, special symbols inside text nodes of
	 * {{#crossLink "Document/_content:property"}}_content{{/crossLink}}
	 * get substituted by their html representations.
	 *
	 * @method         escape
	 * @return         {void}
	 * @since          0.0.6
	 */
	this.escape = function(){
		console.log('Content at the beginning: ', this.getContent());
		var cntn = this.getContent(),
			linkElem;
		if (cntn.nodeType === Node.TEXT_NODE){
			console.log('node is a text one');
			var value = cntn.nodeValue;
			if (value){
				console.log('its value is ' + value);
				linkElem = document.createTextNode(Helper.specialChar(value));
				// console.log('its new value is ' + linkElem.nodeValue);
			}
		} else {
			console.log('node is NOT a text one');
			var children = cntn.childNodes,
				len = children.length,
				i, childDoc;
			console.log('node has ' + len + ' children');
			linkElem = document.createElement(cntn.tagName);
			for (i = 0; i < len; i++){
				console.log(i);
				childDoc = new Document(children[i]);
				childDoc.escape();
				linkElem.appendChild(childDoc.getContent());
			}
		}
		this.setContent(linkElem);
		console.log('Content at the end: ', this.getContent());
	};

	/**
	 * Removes attributes present in array `flies` from the current node without affecting child nodes.
	 * If the node is a not an element node, then nothing is performed upon it.
	 * @method         cleanRoot
	 * @param          {DOM.Node}               node
 	 * @param          {Array}      flies       array of regular expressions
	 * @return         {void}
	 */
	this.cleanRoot = function(node, flies){
		if (flies && node.nodeType === Node.ELEMENT_NODE){
			var nodeAttrs = node.attributes,  // NamedNodeMap of node attributes
				len = nodeAttrs.length,
				attrNames = [],   // array of node attributes (names of the attributes)
				i;
			// populating plain array of node attributes
			for (i = 0; i < len; i++){
				attrNames.push(nodeAttrs[i].name);
			}
			if (attrNames){
				attrNames.forEach(function(attr){
					// whether an attribute matches at least one regular expression
					var doesMatch = flies.some(function(fly){
						return attr.match(fly);
					});
					if (doesMatch){
						node.removeAttribute(attr);
					}
				});
			}
		}
	};


	/**
	 * {{#crossLink "Document/_wrapCss:property"}}_wrapCss{{/crossLink}} setter.
	 *
	 * If necessary, the argument is transformed into a
	 * {{#crossLink "Properties"}}Propreties{{/crossLink}} instance,
	 * and then assigned to {{#crossLink "Document/_wrapCss:property"}}_wrapCss{{/crossLink}}.
	 * @method         setWrapCss
	 * @param          {Any}        css
	 * @since          0.0.6
	 */
	this.setWrapCss = function(css){
		_wrapCss = (css instanceof Properties) ? css : new Properties(css);
		_wrapCss.setMode(1);   /// 1 corresponds to inline styles
	};

	/**
	 * {{#crossLink "Document/_wrapCss:property"}}_wrapCss{{/crossLink}} getter.
	 * @method         getWrapCss
	 * @return         {Properties}
	 * @since          0.0.6
	 */
	this.getWrapCss = function(){
		return _wrapCss;
	};

	/**
	 * Creates a valid html document whose body is given by string `content`.
	 *
	 * **NB**: it uses css of the editor content body.
	 * @method         docHtml
	 * @return         {String}            content of html document
	 */
	this.docHtml = function(){
		var wrapCss = this.getWrapCss(),
			bodyCssStr = wrapCss ? wrapCss.toString() : '';
		if (bodyCssStr){
			bodyCssStr = ' style="' + bodyCssStr + '"';
		}
		var bodyContent = this.getContent();
		bodyContent = bodyContent ? bodyContent.innerHTML : '';
		var header = "<!DOCTYPE html>\n<html>\n<head>\n<meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\">\n</head>\n<body>\n";
		var body = "<center>\n<div" + bodyCssStr + ">\n" + bodyContent +  "\n</div>\n</center>\n";
		var footer = "</body>\n</html>";
		return header + body + footer;
	};

	/**
	 * Converts {{#crossLink "Document/_content:property"}}_content{{/crossLink}} into prescribed format.
	 * @method         convertTo
	 * @param          {String}             format
	 * @return         {void}
	 */
	this.convertTo = function(format){
		var c = this.getConverter();
		if (typeof c.convertTo === 'function'){
			var newContent = c.convertTo(this.getContent(), format);
			if (newContent){
				this.setContent(newContent);
			}

		}
	};


	/**
	 * Considers ancestors of node `n` which are descendants of optional node `scope` and chooses that node
	 * for which `criteria` returns `true`.
	 *
	 * If `scope` is not set, then the search is performed up to the highest root.
	 *
	 * If `scope` is set, but `n` is not its desendant, then an error is thrown.
	 * @method         findAncestor
	 * @param          {DOM.Node}      n          node from which the search is started
	 * @param          {Function}      criteria
	 * @param          {DOM.Node}      scope      [optional] node with which the search is finished
	 * @return         {DOM.Node}
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
		var currentNode = n;
		while (currentNode && (!isScoped || scope.contains(currentNode))){
			try {
				if (criteria(currentNode)){
					return currentNode;
				}
			} catch(e){
				console.log('Error (' + e.name + ') when applying criteria to a node: ' + e.message);
			} finally {
				currentNode = currentNode.parentNode;
			}
		}
	};


	//////////////// start of content of Selection class ///////////

	/**
	 * Current range number (for iterations over the ranges)
	 * @property       {Integer}       _rangePointer
	 * @since          0.0.8
	 * @private
	 */
	var _rangePointer;

	/**
	* Array of [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instances.
	*
	* This array is to store information about selected elements that corresponds to
	* multiple ranges. Each array element corresponds to a contiguous set of elements in the DOM.
	* @property        {Array}         _ranges
	* @since           0.1.0
	* @private
	*/
	var _ranges;


	/**
	 * {{#crossLink "Document/_ranges:property"}}_ranges{{/crossLink}} getter.
	 * @method         getRanges
	 * @return         {Array}          array of [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instances
	 */
	this.getRanges = function(){
	    return _ranges;
	};

	/**
	 * {{#crossLink "Document/_ranges:property"}}_ranges{{/crossLink}} setter.
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
	 * already present in {{#crossLink "Document/_ranges:property"}}_ranges{{/crossLink}} array.
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
	        throw new Error('The argument must be a Range instance!');
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
	 * {{#crossLink "Document/_ranges:property"}}_ranges{{/crossLink}}
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
	 * Returns the next element from {{#crossLink "Document/_ranges:property"}}_ranges{{/crossLink}}
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
	 * Returns array without diplicates of nodes that lay between `n1` and `n2` inclusively.
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
	 * @method         nodesBetween
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
	 * @method         compare
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
	 * @method         commonAncestor
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
	 * @method         commonHead
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
	 * @method         rootOf
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
	 * @method         pathTo
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
	 * Therefore, all linkElem array elements belong to `root` while niether
	 * `root` nor `node` is included.
	 * @method         bunchNextSiblings
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
	 * Therefore, all linkElem array elements belong to `root` while niether
	 * `root` nor `node` is included.
	 * @method         bunchPrevSiblings
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
	 * @method         contains
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
	        if (n === asc){ // node.isEqualNode(asc) --- not good, as it campares by value
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
	 * Returns `true` if the argument is a [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text) instance.
	 * @method         isTextNode
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
	 * @method         detachBoundaries
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
	 * @method         spliceText
	 * @param          {Text}          t              [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text) instance
	 * @param          {Array}         breakpoints    Array of integers in increasing order
	 * @return         {Array|Null}                        Array of [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text) instances
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
	 * Represents nodes that are selected.
	 *
	 * Two dimensional array of nodes. Each element is an array corresponding to a contigouos set
	 * of nodes of a selection.
	 * If nothing is selected, it is set to `null`.
	 * @property       {Array|null}    _selectedNodes
	 * @since          0.1.0
	 * @default        null
	 * @private
	 */
	var _selectedNodes = null;

	/**
	 * {{#crossLink "Document/_selectedNodes:property"}}_selectedNodes{{/crossLink}} getter.
	 * @method         getSelection
	 * @return         {Array|null} [description]
	 */
	this.getSelection = function(){
		return _selectedNodes;
	};


	/**
	 * Cursor position.
	 *
	 * Information about the cursor position is stored inside a collapsed
	 * [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instance.
	 * @property       {Range}         _cursorPosition
	 */
	var _cursorPosition;


	/**
	 * {{#crossLink "Document/_cursorPosition:property"}}_cursorPosition{{/crossLink}} getter.
	 * @method         getCursorPosition
	 * @return         {Range}
	 * @since          0.1.0
	 */
	this.getCursorPosition = function(){
		return _cursorPosition;
	};

	/**
	 * {{#crossLink "Document/_cursorPosition:property"}}_cursorPosition{{/crossLink}} setter.
	 *
	 * Assigns {{#crossLink "Document/_cursorPosition:property"}}_cursorPosition{{/crossLink}}
	 * to be a collapsed [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instance
	 * built from `r`.
	 * @method         setCursorPosition
	 * @param          {Range}              r         [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instance
	 * @return         {void}
	 * @since          0.1.0
	 */
	this.setCursorPosition = function(r){
		if (!(r instanceof Range)){
			return;
		}
		var range = document.createRange();
		range.setStart(r.startContainer, r.startOffset);
		range.collapse(true); // collapsing to the start
		_cursorPosition = range;
	};



	/**
	 * Appends array of nodes to {{#crossLink "Document/_selectedNodes:property"}}_selectedNodes{{/crossLink}}.
	 *
	 * If `nodes` is not array, nothing is performed. Any element of the input array that is not a
	 * [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance, is ignored.
	 * If all elements of the input array are not [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)
	 * instances, nothing is performed.
	 *
	 * @method         _appendToSelectedNodes
	 * @param          {Array}         nodes     array of [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instances
	 * @return         {void}
	 * @private
	 * @since          0.1.0
	 */
	var _appendToSelectedNodes = function(nodes){
		if (!Array.isArray(nodes)){
			return;
		}
		var filtered = [];
		nodes.forEach(function(node){
			if (node instanceof Node){
				filtered.push(node);
			}
		});
		if (filtered.length > 0){
			// var currentSelected = this.getSelection();
			if (Array.isArray(_selectedNodes)){
				_selectedNodes = _selectedNodes.concat([filtered]);
			} else {
				_selectedNodes = [filtered];
			}

		}
	}.bind(this);

	/**
	 * {{#crossLink "Document/_selectedNodes:property"}}_selectedNodes{{/crossLink}} setter.
	 * The arguments is supposed to be a two dimensional array of nodes.
	 * @method         setSelection
	 * @param          {Array}         nodes     two dimensional array of nodes
	 * @return         {void}
	 */
	this.setSelection = function(nodes){
		this.flushSelection();
		if (!Array.isArray(nodes)){
			return;
		}
		nodes.forEach(function(n){
			// n is supposed to be an array  of nodes
			_appendToSelectedNodes(n);
		}.bind(this));
	};

	/**
	 * Clears {{#crossLink "Document/_selectedNodes:property"}}_selectedNodes{{/crossLink}}.
	 *
	 * Sets {{#crossLink "Document/_selectedNodes:property"}}_selectedNodes{{/crossLink}} to `null`.
	 * @method  flushSelection
	 * @return  {void}
	 * @since   0.1.0
	 */
	this.flushSelection = function(){
		_selectedNodes = null;
	};

	/**
	 * Returns array of nodes that belong to [Range](http://https://developer.mozilla.org/en-US/docs/Web/API/Range) instance `r`.
	 * @method         nodesOfRange
	 * @param          {Range}         r         [Range](http://https://developer.mozilla.org/en-US/docs/Web/API/Range) instance
	 * @return         {Array}
	 * @since          0.1.0
	 * @throws         {Error}         If `r` is not a [Range](http://https://developer.mozilla.org/en-US/docs/Web/API/Range) instance
	 */
	this.nodesOfRange = function(r){
		if (!(r instanceof Range)){
			throw new Error('The argument must be a Range instance!');
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
	 * Sets {{#crossLink "Document/_selectedNodes:property"}}_selectedNodes{{/crossLink}} as a
	 * **two dimensional** array of nodes corresponding to the selection.
	 *
	 * The need to assign the selection to a variable is dictated by the fact that during this procedure,
	 * the DOM might suffer modifications which a method
	 * {{#crossLink "Document/detachBoundaries:method"}}detachBoundaries{{/crossLink}} eventually performs.
	 *
	 * The argument is an array of [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instances.
	 *
	 * @method         freezeSelection
	 * @param          {Array}         ranges
	 * @return         {void}
	 * @since          0.1.0
	 */
	this.freezeSelection = function(ranges){
		if (!(Array.isArray(ranges))){
			return;
		}
		var result = [];
		ranges.forEach(function(range){
			var nodes;
			if (range instanceof Range){
				nodes = this.nodesOfRange(range);
				result.push(nodes);
			}
		}.bind(this));
		this.setSelection(result);
		if (ranges.length > 0){
			this.setCursorPosition(ranges[0]);
		}
	};


	/**
	 * Returns array with elements that belong to the selection.
	 *
	 *
	 * If selection is not set, nothing is returned.
	 *
	 * Unlike to {{#crossLink "Document/getSelection:method"}}getSelection{{/crossLink}}, this method returns
	 * one dimensional array of [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) instances.
	 * @method  getSelectionPlain
	 * @since   0.1.0
	 * @return  {Array}
	 */
	this.getSelectionPlain = function(){
		var sel = this.getSelection();
		if (sel){
			return this.flatten(sel);
		}
	};


	/**
	 * Returns text representation of node `n`.
	 *
	 * @method         nodeToText
	 * @param          {Node}          n
	 * @return         {String}
	 * @since          0.1.0
	 */
	this.nodeToText = function(n){
		return (n instanceof Node) ? n.textContent : '';
	};


	/**
	 * Returns text representation of the selected nodes stored in
	 * {{#crossLink "Document/_selectedNodes:property"}}_selectedNodes{{/crossLink}}.
	 *
	 * Remember that {{#crossLink "Document/_selectedNodes:property"}}_selectedNodes{{/crossLink}}
	 * is in general a two dimensional array.
	 *
	 * @method    selectedNodesToText
	 * @param     {String}    elemSeparator           string to be used as a separator between elements in array
	 * @param     {String}    blockSeparator          string to be used as a separator between arrays
	 * @return    {String}
	 */
	this.selectedNodesToText = function(elemSeparator, blockSeparator){
		/**
		 * Transforms array of nodes into a string.
		 * @method       _rangeToText
		 * @param        {Array}     nodesArr      array of node instances
		 * @param        {String}    separ         separator to be used as a delimiter between string representations of the nodes
		 * @return       {String}
		 * @private
		 */
		var _rangeToText = function(nodesArr, separ){
			if (!Array.isArray(nodesArr)){
				return '';
			}
			var result = [];
			nodesArr.forEach(function(n){
				var txt = this.nodeToText(n);
				result.push(txt);

			}.bind(this));
			return result.join(separ);
		}.bind(this);

		var result = [],
			bS = blockSeparator || ' ',
			eS = elemSeparator || ' ';
		if (!Array.isArray(this.getSelection())){
			return '';
		}
		this.getSelection().forEach(function(r){
			result.push(_rangeToText(r, eS));
		}.bind(this));
		return result.join(bS);
	};



	/**
	 * Returns `true` if {{#crossLink "Document/_selectedNodes:property"}}_selectedNodes{{/crossLink}} is empty,
	 * `false` otherwise.
	 *
	 * {{#crossLink "Document/_selectedNodes:method"}}_selectedNodes{{/crossLink}} is considered empty
	 * if it is either `null`, an empty array `[]` or an array containing only empty arrays: `[[], [], []]`.
	 * @method         isSelectionEmpty
	 * @return         {Boolean}
	 */
	this.isSelectionEmpty = function(){
	    var s = this.getSelection();
	    if (!s || s.length === 0){
	    	return true;
	    }
	    return s.every(function(arr){
	    	return arr.length === 0;
	    });
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
		///!!! stub
	    // var nodes = this.nodes;
	    // if (!nodes){
	    //     // console.log('nodes are not defined');
	    //     return true;
	    // }
	    // var len = nodes.length;
	    // // exit point if the nodes array length differs form one
	    // if (len !== 1){
	    //     // return true if it is empty and false if it is too long
	    //     return len === 0;
	    // }

	    // // the first (and the only) block of the selection
	    // var firstBlock = nodes[0];
	    // len = firstBlock.length;
	    // // exit point if the firstblock is empty or has more than one element
	    // if (len !== 1){
	    //     // return true if it is empty and false if it is too long
	    //     return len === 0;
	    // }

	    // // the only element
	    // var elem = firstBlock[0];
	    // if (elem.type === CKEDITOR.NODE_TEXT){
	    //     return true;
	    // }
	    // if (elem.type === CKEDITOR.NODE_ELEMENT){
	    //     if (elem.getName() === 'a'){
	    //         len = elem.getChildCount();
	    //         if (len !== 1){
	    //             return len === 0;
	    //         }
	    //         return elem.getChild(0).type === CKEDITOR.NODE_TEXT;
	    //     }
	    //     return false;
	    // }
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
	            linkElem = [],
	            linkElemLen = 0,
	            i, j,
	            isPresent;
	        linkElem.push(first);
	        linkElemLen++;

	        for (i = 1; i < len; i++){
	            isPresent = false;
	            for (j = 0; j < linkElemLen; j++){
	                if (linkElem[j].equals(arr[i])){
	                    isPresent = true;
	                    break;
	                }
	            }
	            if (!isPresent){
	                linkElem.push(arr[i]);
	                linkElemLen++;
	            }
	        }
	        return linkElem;
	    }
	};

	/**
	 * Replaces each element in {{#crossLink "Document/_selection:property"}}_selection{{/crossLink}} by
	 * a link in which this element is located. In case the element is not located inside any link, then it
	 * is leaved without changes. The linkElem array mimics the structure of
	 * {{#crossLink "Document/selected:property"}}selected{{/crossLink}} array: it should be a two-dimensional array
	 * without duplicates.
	 * @method         absorbLink
	 * @return         {void}
	 */
	this.absorbLink = function(){
	    var input = this.nodes,
	        linkElem = [],
	        temp, link;
	    if (this.isEmpty()){
	        // if the selection is empty and the cursor is inside a link,
	        // insert this link into nodes
	        link = this.getStartElement().getAncestor('a', true);
	        if (link){
	            linkElem.push([link]);   // resulting array must be 2-dimensional with a single element
	        }
	    } else {
	        // parse elements in the selectionif it is not empty
	        input.forEach(function(block){
	            if (Array.isArray(block) && block.length > 0){
	                temp = [];
	                block.forEach(function(elem){
	                    link = elem.getAncestor('a', true);
	                    temp.push(link || elem) ;
	                });
	                linkElem.push(dropDuplicates(temp));
	            }
	        });

	    }
	    this.nodes = linkElem;
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
		console.log(prop, val, altVal);
		/// !!! stub
	    // var propName, value, altValue;
	    // if (typeof prop === 'object'){
	    //     propName = prop.name;
	    //     value = prop.value;
	    //     altValue = prop.altValue;
	    // } else {
	    //     propName = prop;
	    //     value = val;
	    //     altValue = altVal;
	    // }
	    // this.nodes.forEach(function(line){
	    //     var dom = new Dom();
	    //     if (line){
	    //         line.forEach(function(node){
	    //             dom.nailStyleProperty(node.$, propName, value, altValue);
	    //         });
	    //     }
	    // });
	};


	/**
	 * Applies `callback` to each element of array `block` until `callback` evaluates to anything
	 * that casts to `true`. Namely that result of `callback` is returned.
	 *
	 * @method         findInBlock
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
	 * Searches among nodes belonging to the selection.
	 *
	 * The method calls {{#crossLink "Document/findInBlock:method"}}findInBlock{{/crossLink}}(`selected nodes`, `callback`)
	 * and if the `selected nodes` is empty, then a node, in which the cursor is located, is given to `callback`.
	 *
	 * Recall that `callback` is a single argument function whose linkElem is returned if it casts to `true`.
	 * @method         extendedSearch
	 * @property       {Function}           callback
	 * @return         {Any}
	 * @since          0.1.0
	 */
	this.extendedSearch = function(callback){
		var sel = this.getSelectionPlain();
		var linkElem;
		if (sel){
			linkElem = this.findInBlock(sel, callback);
		}
		if (!linkElem){
			var cursorPos = this.getCursorPosition();
			if (cursorPos){
				try {
					linkElem = callback(cursorPos.startContainer);
				} catch (e){
					console.log(e.name + ' when applying callback to ', cursorPos.startContainer, ': ' + e.message);
				}
			}
		}
		if (linkElem){
			return linkElem;
		}
	};


	/**
	 * Returns a "flatten" version of the array `arr`.
	 *
	 * @method         flatten
	 * @param          {Array}         arr
	 * @return         {Array}
	 * @since          0.1.0
	 */
	this.flatten = function(arr){
		if (!Array.isArray(arr)){
			return null;
		}
		/**
		 * Appends elements of array `toAppend` to `current`. If the element is of array type, then
		 * the function is called recursively.
		 * @method     flattenAux
		 * @param      {Array}       current
		 * @param      {Array}       toAppend
		 * @return     {Array}
		 * @private
		 */
		var flattenAux = function(current, toAppend){
			toAppend.forEach(function(el){
				if (Array.isArray(el)){
					return flattenAux(current, el);
				}
				current.push(el);
				return current;
			}.bind(this));
			return current;
		};
		return flattenAux([], arr);
	};


	//////////////// end of content of Selection class   ///////////

	//////////////// start of content of Dom class   ///////////
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
	 * @method         proxy
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
	 * Looks for a value of style property `key` of nearest ancestor of `node` in the scope of node `scope`.
	 * If the property is found, its value is returned, otherwise,  `undefined` is returned.
	 *
	 * Limit node `scope` is supposed to contain `node`. Otherwise, the search for the property
	 * is performed up to the "highest" parent of `node`.
	 *
	 * NB: ** optimize algorithm in such a way that DOM is parsed only once even when `scope` is set wrong. **
	 * @method         getInheritedStyleProp
	 * @param          {DOM.Node}           node      [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @param          {DOM.Node}           scope     [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @param          {String}             key       name of property to find among inline style of ancestors
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


		// root = scope;

		// console.log('root', root);
		// // if the scope is not defined or if it is erraneous, impose scope to be the root.
		// if (root === undefined || !root.contains(node)){
		// 	console.log('looping for root', root, root === undefined, !root.contains(node));
		// 	root = node;
		// 	parent = root.parentNode;
		// 	while (parent){
		// 		root = parent;
		// 		parent = root.parentNode;
		// 	}
		// }
		// console.log('root', root);
		// while (root.contains(currentNode)){
		// 	console.log('loop', currentNode);
		// 	// a node might have no "getAttribute" method (as text node does)
		// 	if (typeof currentNode.getAttribute === 'function'){
		// 		stl = new Properties(currentNode.getAttribute('style'));
		// 		stl.setMode(1);
		// 		if (stl.hasProperty(key)){
		// 			return stl.getProperty(key);
		// 		}
		// 	}
		// 	currentNode = currentNode.parentNode;
		// }
	};


	/**
	 * Modifies inline style properties of a {{#crossLink "Document/_proxy:method"}}proxy{{/crossLink}}
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
	        el = this.commonAncestor(el, elTmp);
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
		var outcome = false;
		if (node.style && node.style.getPropertyValue(key)){
			node.style.removeProperty(key);
			if (node.style.length === 0){
				node.removeAttribute('style');
			}
			outcome = true;
		}
		return outcome;

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
			var linkElem = document.createElement('span'),
				textNodeCopy = document.createTextNode(textNode.nodeValue),
				styleValue = this.getInheritedStyleProp(key, textNode),
				styleToggled = styleValue === primary ? secondary : primary;
			linkElem.setAttribute('style', key + ': ' + styleToggled + ';');
			linkElem.appendChild(textNodeCopy);
			return linkElem;
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

	//////////////// end of content of Dom class     ///////////

	/**
	 * Creates an instance of class `C` and then calls its method given by string `loader`
	 * with `data` being used as an argument of that method.

	 * @method         castTo
	 * @param          {Function}        C          class constructor
	 * @param          {String}          loader     name of the method of the returned object to be called
	 *                                              in order initialize object's properties
	 * @param  		   {Any}             data       data to be provided as an argument to `loader` method
	 * @return         {Object}
	 * @since          0.1.0
	 */
	this.castTo = function(C, loader, data){
		if (typeof C !== 'function'){
			return;
		}
		var tag;
		try {
			tag = new C();
		} catch (e){
			return;
		}
		if (typeof tag[loader] === 'function'){
			try {
				tag[loader](data);
			} catch (e){
				console.log(e.name + ' when applying loader ' + loader + ' with argument ' + data + ': ' + e.message);
			}
		}
		return tag;
	};

	/**
	 * Finds a tag specified by string `name` inside {{#crossLink "Document/_content:property"}}_content{{/crossLink}} based on the
	 * selected nodes and cursor position.
	 *
	 * The search is performed among ancestors of nodes belonging to the selection and among ancestors of
	 * the node that contains the cursor position.
	 *
	 * The selection is retrieved by means of {{#crossLink "Document/getSelection:method"}}getSelection{{/crossLink}} method.
	 *
	 * @method         detectTag
	 * @param          {String}     name        tag name
	 * @since          0.1.0
	 * @return         {Element|Null}       instance of [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)
	 */
	this.detectTag = function(name){
		if (typeof name !== 'string'){
			return;
		}
		/**
		 * Whether the argument `e` is an html element with tag `name`.
		 *
		 * Comparison is case-insensitive.
		 *
		 * @method     hasTag
		 * @param      {Any}           e
		 * @return     {Boolean}
		 * @private
		 */
		var hasTag = function(e){
			return (e instanceof Element) && (name.localeCompare(e.tagName, 'en', {sensitivity: 'base'}) === 0);
		}.bind(this);

		/**
		 * Finds a hyperlink among ancestors of element `e`
		 * @method callback
		 * @param  {Node}   e [description]
		 * @return {Element}
		 * @private
		 */
		var callback = function(e){
			return this.findAncestor(e, hasTag);
		}.bind(this);

		var selection = this.getSelectionPlain(),
			candidateNodes = Array.isArray(selection) ?  selection : [],
			cursorPos = this.getCursorPosition();
		if (cursorPos){
			candidateNodes.push(cursorPos.startContainer);
		}
		console.log('datect tag searches among ', candidateNodes);
		return this.findInBlock(candidateNodes, callback);
	};

	/**
	 * Converts selected nodes into hyperlinks.
	 *
	 * Returns a new [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) instance
	 * corresponding to `scope` in which selected nodes (given by array `selection`) are
	 * transformed into hyperlinks described by `template`.
	 * In case when the selection is empty, cursor position is used in order the insert
	 * the hyperlink into `scope`.
	 * @method         convertToLinks
	 * @since          0.1.0
	 * @param          {Node}            scope           a [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @param          {Array}           selection
	 * @param          {Range}           position        collapsed range
	 * @param          {Object}          template
	 * @return         {Element}
	 */
	this.convertToLinks = function(scope, selection, position, template){
		if (!((scope instanceof Node) && (typeof template === 'object'))){
			return;
		}
		if (!Array.isArray(selection) || selection.length === 0){
			return this.insertLinkAt(scope, position, template);
		}
		/// once here, it means that there is a selection
		/// !!! not finished yet!
		throw new Error('Method convertToLinks of class Document is not fully implemented yet!');

	};


	/**
	 * Inserts a hyperlink [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) described
	 * by `template` into DOM of the `scope` at location `position`.
	 *
	 * Returns a new instance of [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) that is
	 * a modification of `scope` as described above.
	 *
	 * If `position` is not a [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instance, a clone
	 * of `scope` is returned.
	 * @method         insertLinkAt
	 * @param          {Element}       scope         [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)
	 *                                               instance in which insertion is to be done
	 * @param          {Range}         position      [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range)
	 *                                               instance describing the location of the insertion
	 * @param          {Object}        template
	 * @return         {Element}                     [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)
	 *                 								 instance
	 * @throws         {Error}         If `scope` is not an [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)
	 *                 				   instance
	 * @since          0.1.0
	 */
	this.insertLinkAt = function(scope, position, template){
		if (!(scope instanceof Element)){
			throw new Error('The first argument must be an Element instance!');
		}
		var clone = scope.cloneNode(true),
			link, path, output;
		if (!(position instanceof Range)){
			return clone;
		}
		try {
			link = new Link();
			link.loadFromTemplate(template);
			path = this.pathTo(position.startContainer, scope);
			output = this.insertNodeAt(clone, path, position.startOffset, link.toNode());
		} catch (e){
			console.log(e.name + ' when inserting link at cursor postion: ' + e.message);
			output = clone;
		}
		return output;
	};

	/**
	 * Returns a copy of `root` in which node `n` is inserted according to position `pos`.
	 *
	 * Array `pos` must contain at least one element. Array of integers `pathToHost`
	 * must correspond to an existing element in the DOM: starting from `root` and following the
	 * branches numbered by integers of `pathToHost` array, one should arrive to a node.
	 *
	 * If the node `n` must be inserted inside a Text node (and not at its boundaries),
	 * then it is splitted and then node `n` is inserted between them. If the node `n` must be
	 * inserted at one of the boundaries of a Text node, then node `n` is appended or prepended
	 * to that text node node.
	 *
	 * Throws an error in the following cases
	 * <ol><li>
	 * `pathToHost` is not an array
	 * </li><li>
	 * `path` is an empty array
	 * </li><li>
	 * `scope` or `n` is not an Element instance
	 * </li><li>
	 * `pathToHost` does not correspond to an exisitng node in DOM
	 * </li></ol>
	 *
	 * @method         insertNodeAt
	 * @param          {Element}       root         [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)
	 *                                              instance in which `n` is to be inserted
	 * @param          {Array}         pathToNode   path to node which becomes parent of `n`
	 * @param          {Integer}       index        number under which node `n` should be available after insertion
	 * @param          {Node}          n
	 * @return         {Element}                    modified copy of `root`
	 * @since          0.1.0
	 * @throws         {Error}                      If `pathToHost` is not an array
	 */
	// this.insertNodeAt = function(root, pathToHost, index, n){
	// 	if (!(root instanceof Element)){
	// 		throw new Error('First argument must be an Element instance!');
	// 	}
	// 	if (!Array.isArray(pathToHost)){
	// 		throw new Error('Second argument must be an array!');
	// 	}
	// 	if (!(n instanceof Node)){
	// 		throw new Error('Fourth argument must be a Node instance!');
	// 	}
	// 	var //clone = root.cloneNode(true),
	// 		clone = root,
	// 		hostNode = this.getNodeByPath(pathToHost, clone);
	// 	if (!(hostNode instanceof Node)){
	// 		throw new Error('Target element is not found!');
	// 	}
	// 	var rightNode, len;
	// 	/// two case are possible:
	// 	/// 1. hostingNode is a text node
	// 	/// 2. hostingNode is an element node
	// 	if (hostNode instanceof Text){
	// 		if (index === 0){
	// 			/// insert in the beginning (no need to split the node)
	// 			hostNode.parentNode.insertBefore(n, hostNode);
	// 		} else {
	// 			len = hostNode.nodeValue.length;
	// 			/// insert in the middle
	// 			if (index < len){
	// 				rightNode = hostNode.splitText(index);
	// 				hostNode.parentNode.insertBefore(n, rightNode);
	// 			}
	// 			/// insert in the end (no need to split the node)
	// 			if (index === len){
	// 				rightNode = hostNode.nextSibling;
	// 				if (rightNode){
	// 					hostNode.parentNode.insertBefore(n, rightNode);
	// 				} else {
	// 					hostNode.parentNode.appendChild(n);
	// 				}
	// 			}
	// 		}
	// 	} else if (hostNode instanceof Element) {
	// 		var children = hostNode.childNodes;
	// 		if (index > children.length){
	// 			throw new Error('Index is too big!');
	// 		}
	// 		if (index === children.length){
	// 			hostNode.appendChild(n);
	// 		} else {
	// 			rightNode = children[index];
	// 			if (!rightNode){
	// 				throw new Error('Wrong index to insert node at!');
	// 			}
	// 			hostNode.insertBefore(n, rightNode);
	// 		}
	// 	}
	// 	return clone;
	// };
	this.insertNodeAt = function(hostNode, n, offset){
		if (!(hostNode instanceof Node)){
			throw new Error('Node instance is expected!');
		}
		if (hostNode instanceof Text){
			return this.insertIntoTextNode(hostNode, n, offset);
		}
		if (hostNode instanceof Element) {
			return this.insertChild(hostNode, n, offset);
		}
		return hostNode;
	};

	/**
	 * Inserts node `n` as a child of `hostNode` at the position `offset`.
	 * @method         insertChild
	 * @param          {Element}       hostNode
	 * @param          {Node}          n
	 * @param          {Integer}       offset
	 * @return         {Element}       reference to `hostNode`
	 * @since          0.1.0
	 */
	this.insertChild = function(hostNode, n, offset){
		console.log('offset = ', offset, 'hostNode = ', hostNode);
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
		return hostNode;
	};


	/**
	 * Inserts node `n` inside text node instance `textNode` at the position `offset`.
	 * @method         insertIntoTextNode
	 * @param          {Text}          hostNode
	 * @param          {Node}          n
	 * @param          {Integer}       offset
	 * @return         {Text}          reference to `hostNode`
	 * @since          0.1.0
	 */
	this.insertIntoTextNode = function(textNode, n, offset){
		if (n instanceof Text){
			var text1 = textNode.nodeValue,
				text2 = n.nodeValue,
				text;
			text = text1.slice(0, offset) + text2 + text1.slice(offset);
			textNode.nodeValue = text;
			return textNode;
		}
		// textNode is NOT a text node
		if (offset === 0){
			/// insert at the beginning (no need to split the node)
			textNode.parentNode.insertBefore(n, textNode);
		} else {
			var rightNode, len;
			len = textNode.nodeValue.length;
			/// insert in the middle
			if (offset < len){
				rightNode = textNode.splitText(offset);
				textNode.parentNode.insertBefore(n, rightNode);
			}
			/// insert in the end (no need to split the node)
			if (offset === len){
				rightNode = textNode.nextSibling;
				if (rightNode){
					textNode.parentNode.insertBefore(n, rightNode);
				} else {
					textNode.parentNode.appendChild(n);
				}
			}
		}
		return textNode;
	};



	/**
	 * Inserts many lists of type  `listType` into `content`. Items of each list are made of nodes corresponding
	 * to elements of array `ranges`.
	 *
	 * @method         insertLists
	 * @param          {Node}          content
	 * @param          {Array}         ranges       array of [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instances
	 * @param          {String}        listType     type of list (ordered or unordered) to be inserted
	 * @return         {void}
	 * @since          0.1.0
	 */
	this.insertLists = function(content, ranges, listType){
		console.log(ranges);
		if (!(content instanceof Node) || !(Array.isArray(ranges))) {
			return;
		}
		ranges.forEach(function(range){
			this.convertRangeToList(range, listType);
		}.bind(this));
	};

	/**
	 * Convert nodes belonging to `range` into a list of type `listType`.
	 *
	 * If `range` contains no nodes, then empty list is inserted at the position specified `range`.
	 * @method         convertRangeToList
	 * @param          {Range}         range      [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instance
	 * @param          {String}        listType
	 * @return         {void}
	 * @since          0.1.0
	 */
	this.convertRangeToList = function(range, listType){
		if (!(range instanceof Range)){
			return;
		}
		console.log(range);
		if (range.collapsed){
			this.insertListAt(listType, range.startContainer, range.startOffset);
			return;
		}
		var nodes = this.nodesOfRange(range);
		if (!Array.isArray(nodes)){
			console.log('collection of nodes inside the range are expected to be returned as array.');
			return;
		}
		var len = nodes.length;
		if (len > 1){
			console.log('Currently multiple nodes in selection are not supported');
			return;
		}
		if (len === 1){
			if (nodes[0] instanceof Text){
				var list = new List(listType);
				list.appendItem(new ListItem());
				var listElem = nodes[0].parentNode.insertBefore(list.toNode(), nodes[0]);
				listElem.childNodes[0].appendChild(nodes[0]);
			}
		}
	};


	/**
	 * Inserts list at a given position.
	 *
	 * The list gets inserted inside node `root` at position `pos` by means of method
	 * {{#crossLink "Document/insertNodeAt:method"}}insertNodeAt{{/crossLink}}.
	 *
	 * @method         insertListAt
	 * @param          {String}        listType        type of list to be inserted (i.e., 'ul' or 'ol')
	 * @param          {Node}          root
	 * @param          {Integer}       pos
	 * @param          {Array}         items           [Optional] array of elements to be treated as list items
	 * @return         {void}
	 * @since          0.1.0
	 */
	this.insertListAt = function(listType, root, pos, items){
		var list = new List(listType);
		list.appendAsItems(items || ['']);
		this.insertNodeAt(root, list.toNode(), pos);
	};

	/**
	 * Converts nodes specified in array `nodes` into list.
	 *
	 * It is supposed that all elements of array `nodes` reside in the same document.
	 *
	 * Each element of the array `nodes` gets transformed into list item
	 * @method         convertNodesToList______UNUSED
	 * @param          {Array}         nodes
	 * @param          {String}        listType
	 * @return         {Node}
	 * @since          0.1.0
	 */
	this.convertNodesToList______UNUSED = function(nodes, listType){
		if (!(Array.isArray(nodes) && nodes.length > 0)){
			return;
		}
		var items = [],
			list = new List(listType),
			factory = this.getFactory(),
			len = nodes.length,
			item, i;
		for (i = 0; i < len; i++) {
			item = factory.mimic(nodes[i]);
			if (!item.isEmpty()){
				items.push(item);
			}
			// removing all elements from nodes except for the first node
			if (i > 0){
				nodes[i].parentNode.removeChild(nodes[i]);
			}
		}
		list.appendAsItems(items);
		var firstNode = nodes[0];
		try {
			// replacing the first node
			return firstNode.parentNode.replaceChild(list.toNode(), firstNode);
		} catch (e){
			console.log('Error (' + e.name + ') when converting nodes into a list: ' + e.message);
		}
	};


	/**
	 * Inserts a list which items are populated from the selection. If the selection is empty,
	 * a list item with empty content is generated.
	 * @method         insertList
	 * @param          {CKEDITOR.editor}    editor                 Represents an editor instance.
	 * @param          {String}             listType               Type of the list to insert (ol, ul)
	 * @return         {void}
	 */
	this.insertList_to_delete = function(editor, listType){
		var selection = new Selection(editor),
		    selectedNodes = selection.nodes,                   // 2-dim array
		    factory = NEWSLETTER.factory;
		console.log('CKHelper::insertListNew ', selectedNodes);
		selectedNodes.forEach(function(block){
			var len = block.length,
				elem, list, content, newNode, firstElem;
			list = new List(listType);
			// if the block is empty (it means that the selection is empty), insert a link and exit
			if (len === 0){
				list.appendElem(new ListItem());
				newNode = CKEDITOR.dom.element.createFromHtml(list.toHtml());
				editor.insertElement(newNode);
				return null;
			}
			// if still here, it means that the block has at least one item
			firstElem = block.shift().$;                                  // NB: block lenght gets reduced here
			if (len === 1 && (firstElem.nodeType === Node.ELEMENT_NODE)){ // the block has only one item
																		  // and this item is an ELEMENT_NODE
				elem = factory.mimic(firstElem);
				content = elem.getContent();
				list = new List(listType);
				list.appendAsItems(content);
				elem.setElements([list]);
				newNode = elem.toNode();
				firstElem.parentNode.replaceChild(newNode, firstElem);
				return null;
			}
			// default case
			var current = [factory.mimic(firstElem)];         // create array with one element
			block.forEach(function(el){
				current.push(factory.mimic(el.$));
				el.$.remove();
			});
			list.appendAsItems(current);
			newNode = list.toNode();
			firstElem.parentNode.replaceChild(newNode, firstElem);
			// newNode.focus()
		});

	};

}
