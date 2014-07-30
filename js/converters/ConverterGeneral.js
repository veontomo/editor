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
	 * {{#crossLink "ConverterGeneral/_workers:property"}}_workers{{/crossLink}} getter.
	 * @method         getWorkers
	 * @return         {Array}
	 */
	this.getWorkers = function(){
		return _workers;
	};

	/**
	 * Returns number of elements in {{#crossLink "ConverterGeneral/_workers:property"}}_workers{{/crossLink}} array.
	 * @method         numberOfWorkers
	 * @return         {Number}
	 */
	this.numberOfWorkers = function(){
		return _workers.length;
	};



	/**
	 * Gets worker number `i` from {{#crossLink "ConverterGeneral/_worker:property"}}_workers{{/crossLink}}
	 * array.
	 * @method         getWorker
	 * @param          {Number}              i
	 * @return         {Function}
	 */
	this.getWorker = function(i){
		return _workers[i];
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
	 * Converts `n` into fixed format. For proper functioning, it is better to provide a parent
	 * node, because some calculations require knoweledge of parent properties. If parent element is not
	 * provided, default values are used.
	 * @method         convert
	 * @param          {DOM.Node}           n
	 * @param          {DOM.Node}           par       parent of n (optional)
	 * @return         {DOM.Node}
	 */
	this.convert = function(n, par){
		// console.log('convert input: ', n, par);
		var result = n.cloneNode(true),
			parent;
		if (par !== undefined && typeof par.cloneNode === 'function'){
			parent = par.cloneNode(false);
		}
		this.process(result, parent);
		return result;
	};


	/**
	 * Applies each function from {{#crossLink "Converter/_workers:property"}}_worker{{/crossLink}}
	 * to node `n` and then to each children. For proper functioning, it is better to provide a parent
	 * node, because some calculations require knoweledge of parent properties. If parent element is not
	 * provided, default values are used.
	 * @method         process
	 * @param          {DOM.Node}        n
	 * @param          {DOM.Node}        par      parent of n (optional)
	 * @return         {void}
	 */
	this.process = function(n, par){
		// console.log('process input: ', n, par);
		this.processRoot(n, par);
		if (n.nodeType === Node.ELEMENT_NODE){
			var i,
				children = n.childNodes,
				len = children.length;
			for (i = 0; i < len; i++){
				this.process(children.item(i), n);
			}
		}
		// console.log('process is over: ', n.outerHTML);
	};


	/**
	 * Applies all functions from {{#crossLink "ConvertFluid/_workers:property"}}_workers{{/crossLink}} to
	 * only to root element of node `n` and not to its children.
	 * @method         processRoot
	 * @param          {DOM.Node}          n
	 * @param          {DOM.Node}          par    parent of n
	 * @return         {void}
	 */
	this.processRoot = function(n, par){
		var i,
			len = this.numberOfWorkers();
		for (i = 0; i < len; i++){
			this.getWorker(i)(n, par);
		}
	};
}