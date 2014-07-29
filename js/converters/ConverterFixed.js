/*jslint plusplus: true, white: true */
/*global */

/**
 * Methods of this class convert into fixed format.
 * @module 	    HtmlElements
 * @class  		ConverterFixed
 * @since       0.0.5
 * @author      A.Shcherbakov
 */

function ConverterFixed(){
	"use strict";
	if (!(this instanceof ConverterFixed)) {
		return new ConverterFixed();
	}


	/**
	 * Array of functions to be applied to each node. Each element is supposed to modify the argument it acts on.
	 * @property    {Array}               _workers
	 * @type        {Array}
	 * @private
	 */
	var _workers = [];

	/**
	 * Converts `content` into fixed format.
	 * @method         convert
	 * @param          {DOM.Node}           content
	 * @return         {DOM.Node}
	 */
	this.convert = function(n){
		var result = n.cloneNode(true);
		this.process(result);
		return result;
	};


	/**
	 * Applies each function from {{#crossLink "Converter/_workers:property"}}_worker{{/crossLink}}
	 * to node `n` and then to each children.
	 * @method         process
	 * @param          {DOM.Node} n
	 * @return         {void}
	 */
	this.process = function(n){
		this.processRoot(n);
		if (n.nodeType === Node.ELEMENT_NODE){
			var i,
				children = n.childNodes,
				len = children.length;
			for (i = 0; i < len; i++){
				this.process(children.item(i));
			}
		}
	};


	/**
	 * Applies all functions from {{#crossLink "ConvertFluid/_workers:property"}}_workers{{/crossLink}} to
	 * only to root element of node `n` and not to its children.
	 * @method         processRoot
	 * @param          {DOM.Node} n
	 * @return         {void}
	 */
	this.processRoot = function(n){
		var i, len = _workers.length;
		for (i = 0; i < len; i++){
			_workers[i](n);
		}
	};


	/**
	 * Modifies width-related properties in `node`. This function is to be added to
	 * {{#crossLink "ConvertFluid/_workers:property"}}_workers{{/crossLink}}.
	 *
	 * It updates value of width attribute of `node` on the base of the width attribute of its parent node.
	 * @method     _widthFixed
	 * @param      {DOM.Element}        node
	 * @return     {void}
	 * @private
	 */
	var _widthFixed = function(node){
	};

	/**
	 * Updates font sizes.
	 *
	 * @method  _fontFixed
	 * @param  {DOM.Element}    node
	 * @return {void}
	 */
	var _fontFixed = function(node){
	};

	/**
	 * Updates padding.
	 *
	 * @method  _paddingFixed
	 * @param  {DOM.Element}    node
	 * @return {void}
	 */
	var _paddingFixed = function(node){
	};

	_workers.push(_fontFixed);
	_workers.push(_widthFixed);
	_workers.push(_paddingFixed);

}
