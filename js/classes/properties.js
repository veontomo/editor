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
 */
function Properties(input) {
	"use strict";
	if (!(this instanceof Properties)) {
		return new Properties(input);
	}
	var attr, len, i, pair, value, valueFloat, key;

	/**
	 * Object that contains all the properties. Its keys and values must be either strings or numbers.
	 * @property {Object}         core
	 * @type     {Object}
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
	}

	/**
	 * Fill in the properties with the values from the argument if any.
	 * Splits the argument according to tha pattern "key: value;"
	 */
	if (typeof input === 'string'){
		attr = input.split(';');
		len = attr.length;
		// parse each attribute/value pair
		for (i = 0; i < len; i++){
			pair = attr[i].split(':');
			// ignore if there is more than one semicolon
			if (pair.length === 2){
				key = pair[0].trim();
				value =  pair[1].trim();
				// if value contains no spaces, lets try to cast it to number
				if(value.indexOf(' ') === -1){
					valueFloat = parseFloat(value, 10);
					if(valueFloat){
						value = valueFloat;
					}
				}
				this[key] = value;
			}
		}
	}
	if (typeof input === 'object'){
		for (key in input){
			if (input.hasOwnProperty(key)){
				value = input[key];
				if (typeof value === 'string' || typeof value === 'number'){
					this[key] = value;
				}
			}
		}
	}

	/**
	 * Gets the number of properties of the object (all properties to which the object
	 * responds and that are not of function type).
	 * @method  propNum
	 * @return  {Number}
	 */
	this.propNum = function(){
		var prop;
		i = 0;
		for (prop in this){
			if (typeof this[prop] !== 'function'){
				i++;
			}
		}
		return i;
	};

	/**
	 * The  name of the class.
	 * @since       0.0.2
	 * @property    {String} className
	 * @type        {String}
	 */
	this.className = 'Property';

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
	 * @method    appendProperty
	 * @param     {Any}          prop        it will be converted into a Property object and then appended to the target object.
	 * @return    {void}
	 */
	this.appendProperty = function(prop){
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