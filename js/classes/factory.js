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
	 * Returns `true`, if the argument is one of supported types: [Element](https://developer.mozilla.org/en-US/docs/Web/API/element) or
	 * [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text). Otherwise, `false` is returned.
	 * @param    {any}          el
	 * @return   {Boolean}
	 */
	this.isSupported = function(el){
		if (el) {
			var supportedTypes = [Node.ELEMENT_NODE, Node.TEXT_NODE],
				elType = el.nodeType;
			if (elType){
				return (supportedTypes.indexOf(elType) !== -1);
			}
		}
		return false;
	};


	/**
	 * Returns a Tag instance. The argument is an instance of [DOM.Element](https://developer.mozilla.org/en-US/docs/Web/API/element).
	 * @method  produce
	 * @param  {DOM.Element}                elem            what the element is to be created from
	 * @return {Object|Null}
	 * @since  0.0.2
	 */
	this.produce = function(elem){
		var elemType = elem.nodeType,
			tagName, Class, output;
		if (elemType === Node.ELEMENT_NODE){
			tagName = elem.tagName;
		} else if (elemType === Node.TEXT_NODE){
			tagName = 'text';
		} else {
			return null;
		}
		// find out what class instance is to be created
		Class = this.registry.map[tagName] || this.registry.defaultClass;
		output = new Class;
		if (typeof output.load === 'function'){
			output.load(elem);
		}
		return output;
	};


}