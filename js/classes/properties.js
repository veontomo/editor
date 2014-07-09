/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global Property, window */

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
	 * Use {{#crossLink "Properties/getProperty:method"}}getProperty(){{/crossLink}} and
	 * {{#crossLink "Properties/setProperty:method"}}setProperty(){{/crossLink}} methods to
	 * access the content of this object.
	 * @property       {Object}         core
	 * @type           {Object}
	 * @private
	 */
	var core = {};

	/**
	 * Array of allowed types for core keys. Set to 'string', 'number'.
	 * @property       {Array}              allowedCoreKeyTypes
	 * @private
	 * since           0.0.5
	 * @type           {Array}
	 */
	var allowedCoreKeyTypes = ['string', 'number'];

	/**
	 * Array of allowed types for core values. For the moment, it is allowed to have string-valued, number-valued
	 * and object-valued values of the keys.
	 * @property       {Array}              allowedCoreValueTypes
	 * @private
	 * since           0.0.5
	 * @type           {Array}
	 */
	var allowedCoreValueTypes = ['string', 'number', 'object'];


	/**
	 * The  name of the class.
	 * @property        {String}            className
	 * @type            {String}
	 * @private
	 */
	var className = 'Properties';

	/**
	 * Mode to be used when representing this instance as a string by means of
	 * {{#crossLink "Properties/toString:method"}}toString{{/crossLink}} method.
	 * If it is set to 0, then string representation has the following form
	 * `width="20" title="read me!"`
	 * If it is set to 1, then string representation has the following form
	 * `width: 50px; color: red`.
	 * @property       {0|1}                mode
	 * @private
	 * @type           {Integer}
	 * @default        0
	 */
	var mode = 0;

	/**
	 * {{#crossLink "Property/mode:property"}}mode{{/crossLink}} setter. If argument
	 * is different from 0 and 1, it is ignored.
	 * @method         setMode
	 * @param          {Integer}            m
	 * @return         {void}
	 */
	this.setMode = function(m){
		if (m === 1 || m === 0){
			mode = m;
		} else {
			throw new Error('Allowed values for mode are 0, 1.');
		}

	};

	/**
	 * {{#crossLink "Property/mode:property"}}mode{{/crossLink}} getter.
	 * @method         getMode
	 * @return         {Integer}
	 * @since          0.0.5
	 */
	this.getMode = function(){
		return mode;
	};

	/**
	 * {{#crossLink "Properties/className:property"}}Class name{{/crossLink}} getter.
	 * @method         getName
	 * @return         {String}
	 */
	this.getName = function(){
		return className;
	};

	/**
	 * {{#crossLink "Properties/className:property"}}Class name{{/crossLink}} setter.
	 * @method         setName
	 * @param          {String}             name
	 * @return         {void}
	 */
	this.setName = function(name){
		if (typeof name === 'string'){
			className = name;
		}
	};

	/**
	 * If both `key` and `value` are of allowed types (given by
	 * {{#crossLink "Property/allowedCoreKeyTypes:property"}}allowedCoreKeyTypes{{/crossLink}} and
	 * {{#crossLink "Property/allowedCoreValueTypes:property"}}allowedCoreValueTypes{{/crossLink}}), then property `key` of
	 * ({{#crossLink "Properties/core:property"}}core{{/crossLink}}) is set to `value`
	 * and `true` is returned. Otherwise, `false` is returned.
	 * @method   setProperty
	 * @param    {Any}                   key
	 * @param    {Any}                   value
	 * @return   {Boolean}               true in case of success, false otherwise.
	 */
	this.setProperty = function(key, value){
		var keyType = typeof key,
			valueType = typeof value;
		if (this.getAllowedKeyTypes().indexOf(keyType) !== -1 &&  this.getAllowedValueTypes().indexOf(valueType) !== -1){
			core[key] = value;
			return true;
		}
		return false;
	};


	/**
	 * allowed key types getter
	 * @method         getAllowedKeyTypes
	 * @since          0.0.5
	 * @return         {Array}              array of strings
	 */
	this.getAllowedKeyTypes = function(){
		return allowedCoreKeyTypes;
	};

	/**
	 * allowed value types getter
	 * @method         getAllowedValueTypes
	 * @since          0.0.5
	 * @return         {Array}              array of strings
	 */
	this.getAllowedValueTypes = function(){
		return allowedCoreValueTypes;
	};



	/**
	 * Retrieves the value of the requested property from
	 * {{#crossLink "Properties/core:property"}}core{{/crossLink}}
	 * If it does not exist, `undefined` is returned.
	 * @method  getProperty
	 * @return  {Any}
	 */
	this.getProperty = function(key){
		// console.log('I was asked to pick up key ' + key + ' from core ', core);
		if (core.hasOwnProperty(key)){
			return core[key];
		}
	};

	/**
	 * If the key is present in {{#crossLink "Properties/core:property"}}core{{/crossLink}}, drops it and
	 * returns the key value.
	 * @method         dropProperty
	 * @param          {Any}                key
	 * @return         {Any}
	 */
	this.dropProperty = function(key){
		if (core.hasOwnProperty(key)){
			var val = core[key];
			delete core[key];
			return val;
		}
	};

	/**
	 * Replaces {{#crossLink "Properties/core:property"}}core{{/crossLink}} with empty object {}.
	 * @method dropAllProperties
	 * @return {void}
	 */
	this.dropAllProperties = function(){
		core = {};
	};



	/**
	 * Fills in the core with key-value pairs from the argument if any. If the argument
	 * is a string, splits it according to the pattern "key: value;". If the argument is
	 * an object, then it gets its key-value pairs. Obtained blocks are then sent one
	 * by one to {{#crossLink "Properties/setProperty:method"}}setProperty(){{/crossLink}}
	 * method.
	 * @method     appendPropertyAsStringOrObj
	 * @param      {Any}        input
	 * @private
	 * @return     {void}
	 */
	var appendPropertyAsStringOrObj = function (obj, context){
		var attr, value, key, pool = [], source;
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
		if (obj instanceof Properties){
			source = obj.getCore();
		} else if (typeof obj === 'object'){
			source = obj;
		}
		if (source){
			for (key in source){
				if (source.hasOwnProperty(key)){
					value = source[key];
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
		// var rnd = parseInt(Math.random()*10000 , 10);
		// console.info(rnd, 'Properties::appendProperty() is called with ', obj);
		// console.info(rnd, 'Properties::appendProperty() is calling private function appendPropertyAsStringOrObj with 2 arguments: ', obj, this);
		appendPropertyAsStringOrObj(obj, this);
	};


	/**
	 * Switches property `propName` between `val` and `altVal` in the following way:
	 * <ol><li>
	 * if the instance has property `propName` equal to `val`, then the method imposes
	 * its value to be `altVal` (if `altVal` is not defined, then the key `propName` gets dropped).
	 * </li><li>
	 * if the instance contains property `propName` equal to `altVal`, then the method sets
	 * its value to be `val`.
	 * </li><li>
	 * if the instance does not have property `propName`, then the method imposes it to be `val`.
	 * </li></ol>
	 * @method         toggleProperty
	 * @param          {String}        propName       property key to toggle (i.e., "width", "position")
	 * @param          {String}        val            value of property key (i.e., "25em", "fixed")
	 * @param          {String|null}   altVal         alternative value of property key (i.e. null, "0em").
	 *                                                This parameter is optional.
	 * @return         {void}
	 */
	this.toggleProperty = function(propName, val, altVal){
		if (altVal !== undefined){
			this.setProperty(propName,  this.hasSet(propName, [altVal]) ? altVal : val);
			return;
		}
		if (this.hasSet(propName)){
			this.dropProperty(propName);
			return;
		}
		this.setProperty(propName, val);
	};


	/**
	 * Returns `true` if the instance has property `key` set and the value of this property is not
	 * in `ignoreValues` array. Otherwise, `false` is returned.
	 * @method         hasSet
	 * @param          {String}             key                 property name which value is to be checked
	 * @param          {Array|Null}         ignoreValues        Optional. Array of "ignore-values": if key value belongs to
	 *                                                          this array, then the key is considered as not set.
	 *                                                          If this parameter is not an array, then it is ignored.
	 * @return         {Boolean}
	 */
	this.hasSet = function(key, ignoreValues){
		if (!this.hasProperty(key)){
			return false;
		}
		var propValue = this.getProperty(key);
		if (ignoreValues === undefined || !Array.isArray(ignoreValues)){
			return true;
		}
		return ignoreValues.indexOf(propValue) === -1;
	};

	/**
	 * Splits the argument in key-value pieces as it is performed in
	 * {{#crossLink "Properties/appendPropertyAsStringOrObj:method"}}appendPropertyAsStringOrObj(){{/crossLink}}.
	 * If the `key` is not present in the {{#crossLink "Properties/core:property"}}core{{/crossLink}}, it is initialized
	 * with `value`. Otherwise, it is ignored.
	 * @method    suggestProperty
	 * @param     {String|Object}     obj
	 * @return    {void}
	 */
	this.suggestProperty = function(obj){
		var objType = typeof obj,
			attr, key, value,
			that = this;
		if (objType === 'string'){
			attr = obj.split(';');
			attr.forEach(function(pair){
				var split = pair.split(':');
				if (split.length === 2){
					key = split[0].trim();
					value =  split[1].trim();
					if (!that.hasProperty(key)){
						that.setProperty(key, value);
					}
				}
			});
		}
		if (objType === 'object'){
			for (key in obj){
				if (obj.hasOwnProperty(key)){
					if (!that.hasProperty(key)){
						that.setProperty(key, obj[key]);
					}
				}
			}
		}
	};

	/**
	 * Returns `true` if requested property is the {{#crossLink "Properties/core:property"}}core{{/crossLink}} key,
	 * `false` otherwise.
	 * @method   hasProperty
	 * @param    {Any}         key
	 * @return   {Boolean}
	 */
	this.hasProperty = function(key){
		return this.getCore()[key] !== undefined;
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
	 * Returns a copy of the {{#crossLink "Properties/core:property"}}core{{/crossLink}}.
	 * @method       getCore
	 * @return       {Object}
	 */
	this.getCore = function(){
		var output = {},
			attr;
		for (attr in core){
			if (core.hasOwnProperty(attr)){
				// console.log('key ', attr, ' is among my keys');
				output[attr] = core[attr];
			}
		}
		return output;
	};

	/**
	 * Compares {{#crossLink "Properties/core:property"}}core{{/crossLink}} of the target and the argument.
	 * Returns `true` if they are equal, `false` otherwise.
	 * @method    isTheSameAs
	 * @param     {Object} 		obj
	 * @return    {Boolean}
	 */
	this.isTheSameAs = function(obj){
		if (!(obj instanceof Properties)){
			return false;
		}
		var core1 = this.getCore(),
			core2 = obj.getCore(),
			len1 = this.propNum(),
			len2 = obj.propNum();
		if (len1 !== len2){
			return false;
		}
		var keys = Object.keys(core1);
		return keys.every(function(val){
			return core1[val] === core2[val];
		});


	};

	/**
	 * Clones the target. Parses all attributes of the target. If the attribute responds to "clone"
	 * method, then assign the result of this method to the corresponding clone attribute. Otherwise,
	 * assign the attribute value to the clone attribute (potentially problematic for what is passed
	 * by reference and not by value, like arrays).
	 * {{#crossLink "Properties/core:property"}}Core{{/crossLink}} is a private variable, so in the
	 * clone it is populated by means of {{#crossLink "Properties/getProperty:method"}}getProperty(){{/crossLink}}
	 * and {{#crossLink "Properties/setProperty:method"}}setProperty(){{/crossLink}} method.
	 * @method    clone
	 * @return    {Object}
	 */
	this.clone = function(){
		var Constr = window[this.getName()],
			clone, attr, current,
			coreContent = this.getCore();
		clone = (typeof Constr === 'function') ?  new Constr() : new Properties();
		for (attr in this){
			if (this.hasOwnProperty(attr)){
				current = this[attr];
				if (current && typeof current.clone === 'function'){
					clone[attr] = current.clone();
				} else {
					clone[attr] = current;
				}
			}
		}
		for (attr in coreContent){
			if (coreContent.hasOwnProperty(attr)){
				clone.setProperty(attr, coreContent[attr]);
			}
		}
		return clone;
	};

	/**
	 * Returns `true` if {{#crossLink "Properties/core:property"}}core{{/crossLink}} has no keys,
	 * otherwise - `false`.
	 * @method    isEmpty
	 * @return    {Boolean}
	 */
	this.isEmpty = function(){
		var coreCopy = this.getCore();
		return (!coreCopy) || (Object.keys(coreCopy).length === 0);
	};
}