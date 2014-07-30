/*jslint plusplus: true, white: true */
/*global Mapper, Node*/

/**
 * Parent class for converters into specific formats.
 * @module 	    HtmlElements
 * @class  		ConverterGeneral
 * @since       0.0.5
 * @author      A.Shcherbakov
 */

function ConverterGeneral(){
	"use strict";
	if (!(this instanceof ConverterGeneral)) {
		return new ConverterGeneral();
	}

	/**
	 * Array of functions to be applied to each node. Each element is supposed to modify the argument it acts on.
	 * @property    {Array}               _workers
	 * @type        {Array}
	 * @private
	 */
	var _workers = [];

	/**
	 * {{#crossLink "ConverterGeneral/_worker:property"}}_worker{{/crossLink}} setter.
	 * Each element of the input array must be a function. Non functions are skipped.
	 * @method         setWorker
	 * @param          {Array}              funs                array of functions
	 * @return         {void}
	 */
	this.setWorkers = function(funs){
		funs.forEach(function(fun){
			try {
				this.appendWorker(fun);
			} catch (e){
				console.log("Error: " + e);
			}
		}.bind(this));
	};

	/**
	 * {{#crossLink "ConverterGeneral/_worker:property"}}_worker{{/crossLink}} getter.
	 * @method         getWorkers
	 * @return         {Array}
	 */
	this.getWorkers = function(){
		return _workers;
	};

	/**
	 * Appends worker to {{#crossLink "ConverterGeneral/_workers:property"}}_workers{{/crossLink}}.
	 * If the argument is a function, returns `true`, else returns `false`.
	 * @method         appendWorker
	 * @return         {boolean}
	 */
	this.appendWorker = function(fun){
		if (typeof fun === 'function'){
			_workers.push(fun);
			return true;
		}
		return false;
	};



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
}