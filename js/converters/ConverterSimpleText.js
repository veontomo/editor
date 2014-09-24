/*jslint plusplus: true, white: true */
/*global ConverterGeneral, NEWSLETTER, Node, Unit */

/**
 * Methods of this class convert a node into a simple text format.
 *
 *  A simple format text is a text containing html tags corresponding to bold, italic etc. font.
 * @module 	    HtmlElements
 * @class  		ConverterSimpleText
 * @since       0.0.6
 * @author      A.Shcherbakov
 */

function ConverterSimpleText(){
	"use strict";
	if (!(this instanceof ConverterSimpleText)) {
		return new ConverterSimpleText();
	}
	// ConverterGeneral.call(this);

	/**
	 * Objects that defines a mapping from html tags that are allowed inside the content into
	 * a "revisited" tag.
	 * @property       {Object} _tagsToRivisit
	 * @private
	 * @since          0.0.6
	 * @type           {Object}
	 */
	var _tagsToRivisit = {
		b: {'font-weight': 'bold'},
		strong: {'font-weight': 'bold'},
		i: {'font-style': 'italics'}
	};

	/**
	 * Allowed tags.
	 *
	 * Despite the fact the content is plain text
	 * @type {Array}
	 */
	var _tagsAllowed = ['b', 'em', 'strong', 'i'];


	/**
	 * [_workers description]
	 * @param  {[type]} n [description]
	 * @return {[type]}   [description]
	 */

	/**
	 * Array of workers.
	 * @type {Array}
	 */
	var _workers = [];


	/**
	 * Converts `n` into fixed format. For proper functioning, it is better to provide a parent
	 * node, because some calculations require knoweledge of parent properties. If parent element is not
	 * provided, default values are used.
	 * @method         convert
	 * @param          {DOM.Node}           n
	 * @param          {DOM.Node}           par       parent of n (optional)
	 * @return         {DOM.Node}
	 */
	this.convert = function(n){
		var newNode = this.process(n);
		if (newNode && newNode.nodeType !== Node.ELEMENT_NODE){
			// if newNode is not Element node, then just return it
			return newNode;
		}
		// if newNode is an Element node, try to append children from original node n
		var result = n.cloneNode(true);
		return result;
	};


	/**
	 * Modifies width-related properties in `node`. This function is to be added to
	 * {{#crossLink "ConvertFluid/_workers:property"}}_workers{{/crossLink}}.
	 *
	 * It adds keys `max-width` and `min-width` into style properties as well.
	 * @method         _widthFixed
	 * @param          {DOM.Element}        node
	 * @return         {void}
	 * @private
	 */
	var _convertLink = function(node){
		console.log('inside _convertLink');
		if (node.nodeType !== Node.ELEMENT_NODE){
			console.log('node is not an element');
			return undefined;
		}
		console.log('node is an element');
		if (node.tagName.toLowerCase() === 'a'){
			console.log('it is a link');
			console.log('node value is: ' + node.innerHTML);
			node = document.createTextNode(node.innerHTML);
		}
		console.log('_convertLink is over');
	};

	/**
	 * Maps node `n` into another object.
	 * @param  {DOM.Node} n [description]
	 * @return {DOM.Node|null}   [description]
	 */
	this.process = function(n){
		/// !!! stub
		return n;
	};




}
// ConverterSimpleText.prototype = Object.create(ConverterGeneral.prototype);
