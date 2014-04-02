/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global Node */

/**
 * This class is to be used to create different objects. What type of object is to be created is decided based on information
 * passed as argument when creating Factory class. The argument is supposed to be {{#crossLink "Registry"}}Registry{{/crossLink}}
 * instance.
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
	 * Returns `true`, if the argument is of one of supported types: [Element](https://developer.mozilla.org/en-US/docs/Web/API/element) or
	 * [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text). Otherwise, `false` is returned.
	 * @method   isSupported
	 * @param    {any}          elem
	 * @return   {Boolean}
	 */
	this.isSupported = function(elem){
		if (elem) {
			var supportedTypes = [Node.ELEMENT_NODE, Node.TEXT_NODE],
				elType = elem.nodeType;
			if (elType){
				return (supportedTypes.indexOf(elType) !== -1);
			}
		}
		return false;
	};

	/**
	 * Returns a tag name for the argument. If the argument has non-empty string-valued `tagName` property,
	 * its value is returned. Otherwise, string "text" is returned.
	 * @method    tagFor
	 * @param     {any}        elem
	 * @return    {String}
	 */
	this.tagFor = function(elem){
			if (elem){
			var elemTag = elem.tagName;
			if (elemTag && typeof elemTag === 'string' && elemTag !== ''){
				return elemTag;
			}
		}
		return 'text';
	};


	/**
	 * Returns a class to produce an object corresponding to the argument. Alias for the method
	 * {{#crossLink "Registry/classForTag:method"}}Registry::classForTag(){{/crossLink}}
	 * called with {{#crossLink "Factory/tagFor:method"}}Factory::tagFor(elem){{/crossLink}}.
	 * @method     classFor
	 * @param      {any}        elem
	 * @return     {Function}
	 */
	this.classFor = function(elem){
		var tag = this.tagFor(elem);
		return this.registry.classForTag(tag);
	};


	/**
	 * Returns a Tag instance. The argument is an instance of [DOM.Element](https://developer.mozilla.org/en-US/docs/Web/API/element).
	 * @method  produce
	 * @param  {DOM.Element}                elem            what the element is to be created from
	 * @return {Object|Null}
	 * @since  0.0.2
	 */
	this.produce = function(elem){
		if (!this.isSupported(elem)){
			return null;
		}
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