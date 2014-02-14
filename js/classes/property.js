/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global Property */

/**
 * A general Property class. If the argument is an object, then its properties are copied
 * into Property instance. If the argument is a string, then it will be splitted according to
 * the pattern "key: value;" to populate object properties. If, in addition, the "value" can be
 * cast to a number, it will be done.
 * @module 	    Property
 * @class  		Property
 * @param       {String|Object} 	input     an argument, from which properties will be taken.
 */
function Property(input) {
	"use strict";
	if (!(this instanceof Property)) {
		return new Property();
	}
	var attr, len, i, pair, value, valueFloat, key;

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



}