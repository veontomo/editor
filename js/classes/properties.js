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
		console.log('I was asked to pick up key ' + key + ' from core ', core);
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
				if (obj.hasOwnProperty(key)){
					value = obj[key];
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
		return appendPropertyAsStringOrObj(obj, this);

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
	 * The  name of the class.
	 * @property    {String} className
	 * @type        {String}
	 */
	this.className = 'Properties';

	/**
	 * Returns a copy of the {{#crossLink "Properties/core:property"}}core{{/crossLink}}.
	 * @method       getCore
	 * @return       {Object}
	 */
	this.getCore = function(){
		console.log('Properties::getCore(). Core = ', core, ', keys: ', Object.keys(core), ', core again: ', core);
		var output = {},
			attr;
		for (attr in core){
			// console.log('consider key ', attr);
			if (core.hasOwnProperty(attr)){
				console.log('key ', attr, ' is among my keys');
				output[attr] = core[attr];
			} else {
				console.log('key ', attr, ' is NOT among my keys');
			}
		}
		console.log('Properties::getCore(). Returning ', output);
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
	this.summary = function(){
		// var output = {},
		// 	prop, propType, propValue;
		// for (prop in this){
		// 	if (this.hasOwnProperty(prop)){
		// 		propValue = this[prop];
		// 		propType = typeof propValue;
		// 		if (propType === 'string' || propType === 'number'){
		// 			output[prop] = propValue;
		// 		}
		// 	}
		// }
		// return output;
		console.log('This method is deprecated. Use Properties::getCore() instead.');
		return this.getCore();
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

	/**
	 * Clones the target.
	 * @method    clone
	 * @return    {Object}
	 */
	this.clone = function(){
		var factory = this.factory,
			output, attr, current, currentType,
			coreCopy = this.getCore();
		if (factory){
			output = factory.createInstanceOf(this.className);
			console.log('factory = ', factory, ', output = ', output);
			if (output){
				for (attr in coreCopy){
					if (coreCopy.hasOwnProperty(attr)){
						current  = coreCopy[attr];
						currentType = typeof current;
						if (currentType === 'string' || currentType === 'number'){
							output.setProperty(attr, current);
						}
					}
				}
			}
		}
		return output || null;
	};
}