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
	 * @property    {Object}         core
	 * @type        {Object}
	 * @private
	 */
	var core = {};

	/**
	 * The  name of the class.
	 * @property        {String}            className
	 * @type            {String}
	 * @private
	 */
	var className = 'Properties';

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
	 * Returns an object containing string/number-valued properties (and not methods).
	 * @method summary
	 * @return {Object}
	 * @deprecated   Use getCore() instead.
	 */
	this.summary_ = function(){
		console.log('This method is deprecated. Use Properties::getCore() instead.');
		return this.getCore();
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