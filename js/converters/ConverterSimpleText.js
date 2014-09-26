/*jslint plusplus: true, white: true */
/*global ConverterGeneral, NEWSLETTER, Worker, Node */

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
	 * Array of workers.
	 * @property {Array} _workers         array of Worker instances
	 * @type {Array}
	 */
	var _workers = [];


	/**
	 * {{#crossLink "ConverterSimpleText/_workers:property"}}_workers{{/crossLink}} getter.
	 * @method        getWorkers
	 * @return        {Array}          array of Worker instances
	 */
	this.getWorkers = function(){
		return _workers;
	};


	/**
	 * Converts node `n` applying {{#crossLink "ConverterSimpleText/precess:method"}}process{{/crossLink}}
	 * method on it.
	 * If the resulting node admits appending child nodes, then convert child nodes (if any) of `n` and append them
	 * to the resulting node.
	 *
	 * @method         convert
	 * @param          {DOM.Node}           n
	 * @return         {Any}
	 */
	this.convert = function(n){
		var newNode = this.process(n);
		if (newNode && newNode.nodeType !== Node.ELEMENT_NODE){
			// if newNode is not Element node, then just return it
			return newNode;
		}
		// if newNode is an Element node, try to append children from original node n
		var oldChildren = n.childNodes,
			len = oldChildren.length,
			i, newChild;
		for (i = 0; i < len; i++){
			newChild = this.convert(oldChildren[i]);
			if (newChild){
				newNode.appendChild(newChild);
			}
		}
		return newNode;
	};



	/**
	 * Applies each element from {{#crossLink "ConverterSimpleText/_workers:property"}}_workers{{/crossLink}}
	 * array on `n`.
	 * Returns the result of consequitive application of those elements on `n`.
	 * @method         process
	 * @param          {DOM.Node}      n
	 * @return         {DOM.Node|null}
	 */
	this.process = function(n){
		var workers = this.getWorkers(),
			len = workers.length,
			i,
			nCopy = n;
		for (i = 0; i < len; i++){
			nCopy = workers[i].elaborate(nCopy);
		}
		return nCopy;
	};


	/**
	 * Workers.
	 * @property {Function} linkTrigger
	 *
	 */
	var linkTrigger = function(n){
			return n && n.nodeType === Node.ELEMENT_NODE && n.tagName.toLowerCase() === 'a';
		},
		linkAction = function(n){
			return document.createTextNode(n.innerHTML);
		},
		linkWorker = new Worker(linkTrigger, linkAction);

	var imageTrigger = function(n){
			return n && n.nodeType === Node.ELEMENT_NODE && n.tagName.toLowerCase() === 'img';
		},
		imageAction = function(n){
			return document.createTextNode(n.getAttribute('alt') || n.getAttribute('title'));
		},
		imageWorker = new Worker(imageTrigger, imageAction);




	_workers.push(linkWorker);
	_workers.push(imageWorker);






}
// ConverterSimpleText.prototype = Object.create(ConverterGeneral.prototype);
