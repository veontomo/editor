/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global Node */

/**
 * This class is used to generate instances of Tag class, its children or of Content class.
 * @module 	    HtmlElements
 * @class  		Factory
 * @param       {Registry}   reg          an instance of Registry class
 * @since       0.0.2
 * @author      A.Shcherbakov
 *
 */
function Factory(reg){
	"use strict";
	if (!(this instanceof Factory)) {
		return new Factory(reg);
	}




	/**
	 * An instance of {{#crossLink "Registry"}}Registry{{/crossLink}} class.
	 * @property  registry
	 * @type     {Object}
	 */
	this.registry = reg;


	/**
	 * Returns a Tag instance. The argument is an instance of [DOM.Element](https://developer.mozilla.org/en-US/docs/Web/API/element).
	 * @method  produce
	 * @param  {DOM.Element}                elem    what the element is to be created from
	 * @return {Object|Null}
	 * @since  0.0.2
	 */
	this.produce = function(elem){
		var elemType = elem.nodeType,
			tagName, ConstructorClass, output;
		if (elemType === Node.ELEMENT_NODE){
			tagName = elem.tagName;
		} else if (elemType === Node.TEXT_NODE){
			tagName = 'text';
		} else {
			return null;
		}
		ConstructorClass = this.registry.map[tagName] || this.registry.defaultClass;
		output = new ConstructorClass;
		if (typeof output.load === 'function'){
			output.load(elem);
		}
		return output;
	};


}