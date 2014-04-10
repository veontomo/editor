/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global Property, Factory */

/**
 * A general Property class. If the argument is an object, then its properties are copied
 * into Property instance. If the argument is a string, then it will be splitted according to
 * the pattern "key: value;" to populate object properties.
 * @module 	    Properties
 * @class  		Properties
 * @param       {String|Object} 	input     an argument, from which properties will be taken.
 * @since       0.0.3
 *
 */
function Properties(input) {
	"use strict";
	if (!(this instanceof Properties)) {
		return new Properties(input);
	}


	/**
	 * Object that contains all the properties. Its keys and values must be either strings or numbers.
	 * @property    {Object}         core
	 * @type        {Object}
	 * @private
	 */
	var core = {};

	/**
	 * If `key` and `value` are either string or number, then property `key`
	 * ({{#crossLink "Properties/core:property"}}core{{/crossLink}}) is set to `value`
	 * and `true` is returned. Otherwise, `false` is returned.
	 * @method   setProperty
	 * @param    {String|Number}         key
	 * @param    {String|Number}         value
	 * @return   {Boolean}               true in case of success, false otherwise.
	 */
	this.setProperty = function(key, value){
		var allowedTypes = ['string', 'number'],
			keyType = typeof key,
			valueType = typeof value;
		if (allowedTypes.indexOf(keyType) !== -1 &&  allowedTypes.indexOf(valueType) !== -1){
			core[key] = value;
			return true;
		}
		return false;
	};


	/**
	 * Retrieves the value of the requested property from
	 * {{#crossLink "Properties/core:property"}}core{{/crossLink}}
	 * If it does not exist, `undefined` is returned.
	 * @method  getProperty
	 * @return  {Any}
	 */
	this.getProperty = function(key){
		if (core.hasOwnProperty(key)){
			return core[key];
		}
	};

	/**
	 * If the key is present in {{#crossLink "Properties/core:property"}}core{{/crossLink}}, drops it.
	 * @method  dropProperty
	 * @param   {Any}        key
	 * @return  {void}
	 */
	this.dropProperty = function(key){
		if (core.hasOwnProperty(key)){
			delete core[key];
		}
	};



	/**
	 * Fills in the core with key-value pairs from the argument if any. If the argument
	 * is a string, splits it according to the pattern "key: value;". If the argument is
	 * an object, then it gets its key-value pairs. Obtained blocks are then sent one
	 * by one to {{#crossLink "Properties/setProperty:method"}}setProperty(){{/crossLink}}
	 * method.
	 * @method    appendPropertyAsStringOrObj
	 * @param     {Any}        input
	 * @private
	 */
	var appendPropertyAsStringOrObj = function (obj, context){
		var attr, value, key, pool = [];
		if (typeof obj === 'string'){
			attr = obj.split(';');
			attr.forEach(function(pair){
				var split = pair.split(':');
				if (split.length === 2){
					key = split[0].trim();
					value =  split[1].trim();
					pool.push([key, value]);
				}
			});
		}
		if (typeof obj === 'object'){
			for (key in obj){
				if (input.hasOwnProperty(key)){
					value = input[key];
					pool.push([key, value]);
				}
			}
		}
		pool.forEach(function(pair){
			context.setProperty(pair[0], pair[1]);
		});
	};

	appendPropertyAsStringOrObj(input, this);

	/**
	 * Adds properties into {{#crossLink "Properties/core:property"}}core{{/crossLink}}. It passes its argument to a
	 * private method
	 * {{#crossLink "Properties/appendPropertyAsStringOrObj:method"}}appendPropertyAsStringOrObj(){{/crossLink}}.
	 * @method    appendProperty
	 * @param     {Any}               obj
	 * @return    {void}
	 */

	this.appendProperty = function(obj){
		return appendPropertyAsStringOrObj(obj, this);
	};

	/**
	 * Gets the number of records in {{#crossLink "Properties/core:property"}}core{{/crossLink}}.
	 * @method  propNum
	 * @return  {Number}
	 */
	this.propNum = function(){
		return Object.keys(core).length;
	};

	/**
	 * The  name of the class.
	 * @property    {String} className
	 * @type        {String}
	 */
	this.className = 'Properties';

	/**
	 * Compares properties of the target and with the proprties of the argument.
	 * Returns true, if they are pair-wise the same (key of the target is present among argument keys, and the values are equal).
	 * Otherwise, false is returned. When making comparison, all methods are ignored.
	 * @method    isTheSameAs
	 * @param     {Object} 		obj
	 * @return    {Boolean}
	 */
	this.isTheSameAs = function(obj){
		var prop;
		for (prop in this){
			if (this.hasOwnProperty(prop) && (typeof this[prop] !== 'function') && (obj[prop] === undefined || this[prop] !== obj[prop])) {
				return false;
			}
		}
		for (prop in obj){
		 	if (obj.hasOwnProperty(prop) && (typeof obj[prop] !== 'function') && (this[prop] === undefined || this[prop] !== obj[prop])){
		 		return false;
		 	}
		}
		return true;
	};

	/**
	 * Appends property. Converts the argument to a Property and appends it to the target one.
	 * Properties with the same name will be overridden.
	 * @method    appendProperty___
	 * @param     {Any}          prop        it will be converted into a Property object and then appended to the target object.
	 * @return    {void}
	 */
	this.appendProperty___ = function(prop){
		var styleProp,
			styleObj = new Style(prop);
		for (styleProp in styleObj){
			if (styleObj.hasOwnProperty(styleProp) && (typeof styleObj[styleProp]  !== 'function')){
				this[styleProp] = styleObj[styleProp];
			}
		}
	};

	/**
	 * Returns an object containing string/number-valued properties (and not methods).
	 * @method summary
	 * @return {Object}
	 */
	this.summary = function(){
		var output = {},
			prop, propType, propValue;
		for (prop in this){
			if (this.hasOwnProperty(prop)){
				propValue = this[prop];
				propType = typeof propValue;
				if (propType === 'string' || propType === 'number'){
					output[prop] = propValue;
				}
			}
		}
		return output;
	};

	/**
	 * This property is required in order to be able to recreate an instance of
	 * this class or its child.
	 * It is supposed to be an instance of {{#crossLink "Factory"}}Factory{{/crossLink}} class.
	 * Its value will be initialized properly when creating a clone of this element (or of one
	 * of its child). If it is not present, {{#crossLink "Factory"}}Factory{{/crossLink}} will
	 * not be able to initialize it.
	 * @property   {Object|Null}   factory
	 * @default    Null
	 * @since      0.0.3
	 */
	this.factory = null;

	/**
	 * Sets `factory` property. Returns `true` if the argument is an instance of
	 * {{#crossLink "Factory"}}Factory{{/crossLink}}, `false` otherwise.
	 * @method  setFactory
	 * @param   {Factory}    factory        instance of  {{#crossLink "Factory"}}Factory{{/crossLink}} class.
	 * @return  {Boolean}
	 * @since   0.0.3
	 */
	this.setFactory = function(factory){
		if(factory instanceof Factory){
			this.factory = factory;
			return true;
		}
		return false;
	};



}