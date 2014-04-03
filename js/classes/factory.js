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
	 * Creates a class instance; the class is one of
	 * {{#crossLink "Registry/classes:property"}}Registry::classes{{/crossLink}} or
	 * {{#crossLink "Registry/defaultClass:property"}}Registry/defaultClass{{/crossLink}}.
	 * The argument is an instance of [DOM.Element](https://developer.mozilla.org/en-US/docs/Web/API/element).
	 * @method  createInstance
	 * @param   {DOM.Element}                elem            what the element is to be created from
	 * @return  {Object|Null}
	 * @since   0.0.2
	 */
	this.createInstance = function(elem){
		if (!this.isSupported(elem)){
			return null;
		}
		var ClassName  = this.classFor(elem),
			output = new ClassName;
		return output;
	};

	/**
	 * Loads the properties from the second argument into the first. Returns `true` if the first argument
	 * responds a method `load` and calls it with the second argument. If that method does not exist or the arguments are
	 * `undefined` or `null`, returns `false`.
	 * @method  brightenObj
	 * @param   {Object}       obj
	 * @param   {Object}       elem
	 * @return  {Boolean}
	 */
	this.brightenObj = function(obj, elem){
		if (obj && elem && (typeof obj.load === 'function')){
			obj.load(elem);
			return true;
		}
		return false;
	};


	/**
	 * Produces a class instance corresponding to the argument and populates properties of the newly created instance
	 * from the argument. The operation consists of two:
	 * <ol><li>
	 * calls {{#crossLink "Factory/createInstance:method"}}Factory::createInstance(){{/crossLink}} method to
	 * create the instance
	 * </li><li>
	 * calls {{#crossLink "Factory/brightenObj:method"}}Factory::brightenObj(){{/crossLink}} method to populate
	 * the newly created object with properties
	 * </li></ol>
	 * @method  produce
	 * @param  {Object} elem
	 * @return {Object}
	 */
	this.produce = function(elem){
		var product = this.createInstance(elem);
		this.brightenObj(product, elem);
		return product;
	};

}