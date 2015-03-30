/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global Properties, window, Unit */

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
	 * @property       {Array}              _allowedCoreKeyTypes
	 * @private
	 * since           0.0.5
	 * @type           {Array}
	 */
	var _allowedCoreKeyTypes = ['string', 'number'];

	/**
	 * Array of allowed types for core values. For the moment, it is allowed to have string-valued, number-valued
	 * and object-valued values of the keys.
	 * @property       {Array}              _allowedCoreValueTypes
	 * @private
	 * since           0.0.5
	 * @type           {Array}
	 */
	var _allowedCoreValueTypes = ['string', 'number', 'object'];


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
	 * @property       {0|1}                _mode
	 * @private
	 * @type           {Integer}
	 * @default        0
	 */
	var _mode = 0;

	/**
	 * {{#crossLink "Properties/_mode:property"}}_mode{{/crossLink}} setter. If argument
	 * is different from 0 and 1, it is ignored.
	 * @method         setMode
	 * @param          {Integer}            m
	 * @return         {void}
	 */
	this.setMode = function(m){
		if (m === 1 || m === 0){
			_mode = m;
		} else {
			throw new Error('Allowed values for mode are 0, 1.');
		}

	};

	/**
	 * {{#crossLink "Property/_mode:property"}}_mode{{/crossLink}} getter.
	 * @method         getMode
	 * @return         {Integer}
	 * @since          0.0.5
	 */
	this.getMode = function(){
		return _mode;
	};

	/**
	 * {{#crossLink "Properties/className:property"}}className{{/crossLink}} getter.
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
	 * Sets value of `style` key. Converts argument into {{#crossLink "Properties"}}Properties{{/crossLink}} instance
	 * and then performs assignment.
	 * @method         setStyles
	 * @param          {Any}                stl
	 * @return         {void}
	 * @since          0.0.5
	 */
	this.setStyles = function(stl){
		core.style = stl instanceof Properties ? stl : new Properties(stl);
		core.style.setMode(Properties.MODE_STYLE);
	};

	/**
	 * If both `key` and `value` are of allowed types (given by
	 * {{#crossLink "Properties/_allowedCoreKeyTypes:property"}}_allowedCoreKeyTypes{{/crossLink}} and
	 * {{#crossLink "Properties/_allowedCoreValueTypes:property"}}_allowedCoreValueTypes{{/crossLink}}), then property `key` of
	 * {{#crossLink "Properties/core:property"}}core{{/crossLink}} is set to `value`
	 * and `true` is returned. Otherwise, `false` is returned. If `key` is a string `style`, then method
	 * {{#crossLink "Properties/setStyles:method"}}setStyles(){{/crossLink}} is envoked.
	 * @method   setProperty
	 * @param    {Any}                   key
	 * @param    {Any}                   value
	 * @return   {Boolean}               true in case of success, false otherwise.
	 */
	this.setProperty = function(key, value){
		var keyType = typeof key,
			valueType = typeof value;
		if (this.getAllowedKeyTypes().indexOf(keyType) !== -1 && this.getAllowedValueTypes().indexOf(valueType) !== -1){
			if (key === 'style'){
				this.setStyles(value);
			} else {
				core[key] = value;
			}
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
		return _allowedCoreKeyTypes;
	};

	/**
	 * allowed value types getter
	 * @method         getAllowedValueTypes
	 * @since          0.0.5
	 * @return         {Array}              array of strings
	 */
	this.getAllowedValueTypes = function(){
		return _allowedCoreValueTypes;
	};

	/**
	 * Splits string in two parts by a delimiter.
	 *
	 * Splits `str` in two parts by finding last occurence of delimiter. Returns
	 * an array whose first element is what comes before the last occurence of the
	 * delimiter and the second one is what comes after.

	 * If delimiter is not present, nothing is returned.
	 * @method         _splitBy
	 * @param          {String}        key
	 * @param          {String|Null}   delim    [optional] delimiter. By default it is set to '-'.
	 * @return         {Array}
	 */
	var _splitBy = function(str, delim){
		delim = delim || '-';
		var re = new RegExp("^(.*)-(.*$)"),
			res = str.match(re);
		if (res){
			return [res[1], res[2]];
		}
	};

	/**
	 * Retrieves the value of the requested property from
	 * {{#crossLink "Properties/core:property"}}core{{/crossLink}}.
	 * If property `key` does not exist, but its pattern is `base-side`, where `side` is one of
	 * `left`, `right`, `top` or `bottom` and `base` key exists, then is it returned a value based on the
	 * format of the `base` property:
	 * <dl><dt>"X"</dt><dd>`base-top`, `base-right`, `base-bottom`, `base-left` are equal to `X`</dd>
	 * <dt>"X Y"</dt><dd>`base-top` = X, `base-right` = Y, `base-bottom` = X, `base-left` = `Y`</dd>
	 * <dt>"X Y Z"</dt><dd>`base-top` = X, `base-right` = Y, `base-bottom` = Z, `base-left` = `X`</dd>
	 * <dt>"X Y Z W"</dt><dd>`base-top` = X, `base-right` = Y, `base-bottom` = X, `base-left` = `W`</dd>
	 * </dl>
	 * @method         getProperty
	 * @param          {String|Number}        key      name of the property
	 * @return         {Any}
	 */
	this.getProperty = function(key){
		if (!(typeof key === 'string' || typeof key === 'number')){
			return;
		}
		if (core.hasOwnProperty(key)){
			return core[key];
		}
		var arr = _splitBy(key, '-');
		if (arr){
			return this.getPropertyBySide(arr[0], arr[1]);
		}
	};

	/**
	 * Array of possible side names.
	 *
	 * The order of elements matters for
	 * {{#crossLink "Properties/getPropertyBySide:method"}}getPropertyBySide{{/crossLink}}.
	 * @property       {Array}         _allowedSides
	 * @since          0.0.8
	 * @private
	 */
	var _allowedSides = ["top", "right", "bottom", "left"];

	/**
	 * {{#crossLink "Properties/_allowedSides:property"}}_allowedSides{{/crossLink}} getter.
	 * @method         _allowedSides
	 * @return         {Array}
	 * @since          0.0.8
	 */
	this.getAllowedSides = function(){
		return _allowedSides;
	};

	/**
	 * Returns value of property `p` corresponding to `side`.
	 *
	 * Returned valued depends on words (and their number) in value of property `p`
	 * and value of parameter `side`:
	 *
	 * If value of `p` matches:<dl>
 	 * <dt>"X"</dt>      <dd>then `top`, `right`, `bottom`, `left` all correspond to `X`</dd>
	 * <dt>"X Y"</dt>    <dd>then `top`, `right`, `bottom`, `left` correspond respectively to X, Y, X, Y</dd>
	 * <dt>"X Y Z"</dt>  <dd>then `top`, `right`, `bottom`, `left` correspond respectively to X, Y, Z, Y</dd>
	 * <dt>"X Y Z W"</dt><dd>then `top`, `right`, `bottom`, `left` correspond respectively to X, Y, X, W</dd>
	 * </dl>
	 *
	 * If property `p` is not set or `side` is not of allowed value, nothing is returned.
	 * @method         getPropertyBySide
	 * @param          {String}                            p
	 * @param          {"top"|"bottom"|"left"|"right"}     side
	 * @return         {String}
	 * @since          0.0.8
	 */
	this.getPropertyBySide = function(p, side){
		var ind = this.getAllowedSides().indexOf(side);
		if (ind === -1){
			return;
		}
		var prop = this.getProperty(p);
		if (!(prop && (typeof prop === 'string' || typeof prop === 'number'))){
			return;
		}
		prop = prop.toString().trim().split(/\s+/);
		switch (prop.length){
			case 1:
				return prop[0];
			case 2:
				return prop[ind % 2];
			case 3:
				return prop[ind < 3 ? ind : 1];
			case 4:
				return prop[ind];
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
	 * If `key` is present in `style` object of {{#crossLink "Properties/styles:property"}}core{{/crossLink}}, drops it and
	 * returns the key value.
	 * @method         dropStyleProperty
	 * @param          {String}                key
	 * @return         {Any}
	 * @since          0.0.5
	 */
	this.dropStyleProperty = function(key){
		if (this.hasStyleProperty(key)){
			var stl = this.getStyles(),
				val = stl.dropProperty(key);
			this.setStyles(stl);
			stl = this.getStyles();
			return val;
		}
	};

	/**
	 * Fills in the core with key-value pairs from the argument if any. If the argument
	 * is a string, splits it according to the pattern "key: value;". If the argument is
	 * an object, then it gets its key-value pairs.
	 * @method     appendPropertyAsStringOrObj
	 * @param      {Any}        input
	 * @private
	 * @return     {void}
	 */
	var appendPropertyAsStringOrObj = function (obj, context){
		var key, value, attrs;
		if (typeof obj === 'string'){
			attrs = context.stringToJson(obj);
		} else if (obj instanceof Properties){
			attrs = obj.getCore();
		} else if (typeof obj === 'object'){
			attrs = obj;
		}
		for (key in attrs){
			if (attrs.hasOwnProperty(key)){
				value = attrs[key];
				if (typeof context.getProperty(key) === 'object' && typeof value === 'object'){
					context.appendToKey(key, value);
				} else {
					context.setProperty(key, value);
				}

			}
		}
	};


	/**
	 * Appends `obj` to the property `prop` of the current object.
	 *
	 * It is supposed that current instance has object-valued property `prop` to which `obj` should be appended.
	 * @method         appendToKey
	 * @param          {String}        prop
	 * @param          {Object}        obj
	 * @return         {void}
	 * @since          0.2.3
	 */
	this.appendToKey = function(key, obj){
		var prop = new Properties(this.getProperty(key));
		prop.appendProperty(obj);
		this.setProperty(key, prop);
	};

	/**
	 * Creates a json-like object from a string.
	 *
	 * For the moment, only inline-style format of strings is supported.
	 * @method         stringToJson
	 * @param          {String}        str
	 * @return         {Object}
	 * @since          0.2.3
	 */
	this.stringToJson = function(str){
		var json = {},
			value, key,
			attr = str.split(Properties.SEPARATOR_RECORDS);
		attr.forEach(function(pair){
			var split = pair.split(Properties.SEPARATOR_KEY_VALUE);
			if (split.length === 2){
				key = split[0].trim();
				value = split[1].trim();
				json[key] = value;
			}
		});
		return json;
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
		appendPropertyAsStringOrObj(obj, this);
	};

	/**
	 * Appends properties to `style` key. If the key does not exist, creates it.
	 * @method         appendStyle
	 * @param          {Properties}         prop
	 * @since          0.0.5
	 * @return         {void}
	 */
	this.appendStyle = function(stl){
		this.initializeStyle();
		this.getStyles().appendProperty(stl);
	};

	/**
	 * Initializes `style` key: if it does not exist, set it to
	 * a new instance of {{#crossLink "Properties"}}Properties{{/crossLink}} with
	 * {{#crossLink "Properties/_mode:property"}}_mode{{/crossLink}} set to 1.
	 * @method         initializeStyle
	 * @since          0.0.5
	 * @return         {void}
	 */
	this.initializeStyle = function(){
		var propName = 'style';
		if (!this.getProperty(propName)){
			var stl = new Properties();
			stl.setMode(Properties.MODE_STYLE);
			this.setProperty(propName, stl);
		}
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
	 * Appends properties of `p` to the current Properties instance
	 * @method _suggestProperty
	 * @private
	 * @param          {Properties}    p
	 * @return         {void}
	 * @since           0.0.7
	 */
	var _suggestProperty = function(p){
		if (!(p instanceof Properties)){
			return;
		}
		var pCore = p.getCore(),
			key, value, objProp;
		for (key in pCore){
			if (pCore.hasOwnProperty(key)){
				value = pCore[key];
				if (!this.hasProperty(key)){
					this.setProperty(key, pCore[key]);
				} else {
					objProp = this.getProperty(key);
					if (value instanceof Properties && objProp instanceof Properties){
						objProp.suggestProperty(value);
					}
				}
			}
		}
	}.bind(this);

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
		if (obj instanceof Properties){
			_suggestProperty(obj);
		}
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
		var coreCopy = this.getCore();
		return coreCopy && typeof coreCopy.hasOwnProperty === 'function' && coreCopy.hasOwnProperty(key);
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

	/**
	 * String representation of the instance. If {{#crossLink "Properties/_mode:property"}}_mode{{/crossLink}} is set to 0,
	 * the representation of the following type is produced:
	 * <div style="font-family: Courier; font-weight: bold;padding: 1em;">width="20" title="read me!"</div>
	 * If {{#crossLink "Properties/_mode:property"}}_mode{{/crossLink}} is set to 1, the representation of the following
	 * type is produced:
	 * <div style="font-family: Courier; font-weight: bold;padding: 1em;">width: 50px; color: red</div>
	 * It parses all {{#crossLink "Properties/core:property"}}core{{/crossLink}} keys and if
	 * <ol><li>
	 * corresponding value responds to a `toString()` method
	 * </li><li>
	 * corresponding value is a number and {{#crossLink "Properties/_mode:property"}}_mode{{/crossLink}} is 1,
	 * then 'px' is appended (**resolve this explicit dependency on unit of measurement!**)
	 * </li><li>
	 * corresponding value is a string
	 * </li>
	 * </ol>
	 * then uses it for further substitution. Otherwise, the value is ignored.
	 *
	 * Further, if the corresponding string representation of the value turns out to be empty or undefined,
	 * the whole key-value pair is ignored.
	 * @method         toString
	 * @return         {String}
	 * @since          0.0.5
	 */
	this.toString = function(){
		var output = [],
		    keys = Object.keys(core),
		    separ1, separ2,
		    md = this.getMode();

		separ1 = md === 1 ? ': ' : '="';
		separ2 = md === 1 ? ';' : '"';

		keys.forEach(function(key){
			var value = core[key],
				str, valueType;
			// some attributes might be deliberately set to null (especially default values)
			if (value !== null){
				valueType = typeof value;
				switch (valueType){
					case 'object':
						if (typeof value.toString === 'function'){
							str = value.toString();
						}
						break;
					case 'number':
						str = value.toString() + (md === 1 ? 'px' : '');
						break;
					default:
						str = value;

				}
			}
			if (typeof str === 'string' && str.length > 0){
				output.push(key.toString() + separ1 + str + separ2);
			}
		});
		return output.join(' ');
	};



	/**
	 * Loads attributes from the argument into {{#crossLink "Properties/core:property"}}core{{/crossLink}}.
	 * Returns `true` if loading succeeds and `false` otherwise.
	 *
	 * To do: for the moment, thw method always returns `true`.
	 *
	 * The argument is supposed to be of a type
	 * [NamedNodeMap](http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core.html#ID-1780488922).
	 * Nevertheless, it is sufficient that `attr` be a collection of objects with `name` and `value` properties.
	 * @method    load
	 * @param     {NamedNodeMap}       attrs           instance of NamedNodeMap
	 * @return    {boolean}                           true, if the properties are loaded, false otherwise
	 */
	this.load = function(attrs){
    	var	len = attrs.length,
    		i, key, val, valNum;
    	for (i = 0; i < len; i++){
			key = attrs[i].nodeName.trim();
			val = attrs[i].nodeValue.trim();
			// console.log(i + ': key = ' + key + ', value = ' + val);
			// try to convert into a string
			valNum = parseFloat(val);
			// console.log(valNum, val);
			if (valNum.toString() === val){
				// console.log('seems to be a number');
				val = valNum;
			}
			this.setProperty(key, val);
    	}

		return true;
	};

	/**
	 * Returns `true` if the instance has key `style`, `false` otherwise. Alias for
	 * {{#crossLink "Properties/hasProperty:method"}}hasProperty('style'){{/crossLink}} method.
	 * @method         hasStyles
	 * @return         {Boolean}
	 */
	this.hasStyles = function(){
		return this.hasProperty('style');
	};

	/**
	 * Returns value of `style` key. Alias for {{#crossLink "Properties/getProperty:method"}}getProperty('styles'){{/crossLink}}.
	 * @method         getStyles
	 * @return         {Properties}
	 * @since          0.0.5
	 */
	this.getStyles = function(){
		return this.getProperty('style');
	};


	/**
	 * Returns `true` if instance contains `style` key inside which there is a key `propName`.
	 * Otherwise, `false` is returned.
	 * @method         hasStyleProperty
	 * @param          {String}             propName
	 * @return         {Boolean}
	 * @since          0.0.5
	 */
	this.hasStyleProperty = function(propName){
		return this.hasStyles() && this.getStyles().hasProperty(propName);
	};


	/**
	 * Sets the `key` to be equal to `value` inside object {{#crossLink "Properties"}}Properties{{/crossLink}}
	 * instance corresponding to `style` key of the current objects which is, naturally,
	 * {{#crossLink "Properties"}}Properties{{/crossLink}} instance as well.
	 *
	 * @method  setStyleProperty
	 * @since   0.0.5
	 * @param   {Any}    key
	 * @param   {Any}    value
	 *
	 */
	this.setStyleProperty = function(key, value){
		this.initializeStyle();
		this.getStyles().setProperty(key, value);
	};


	/**
	 * Returns the value of key `propName` inside `style` key (if it exists) of the current object.
	 * If it does not exist, nothing is returned.
	 * @method  getStyleProperty
	 * @since   0.0.5
	 * @param   {String}    propName
	 * @return  {Any}
	 *
	 */
	this.getStyleProperty = function(propName){
		if (this.hasStyles()){
			return this.getStyles().getProperty(propName);
		}
	};


	/**
	 * Returns object {width: ..., color: ..., style: ...} describing border. If the Style has no Properties
	 * 'border-style', then 'none' will be used. If the Style has no 'border-width', then zero will be used.
	 * If the Style has no Properties 'border-color', then it will not be set.
	 * @method         getBorderInfo
	 * @return         {Object}              object of the form {'width': ..., 'color': ..., 'style': ...}
	 * @since          0.0.5
	 */
	this.getBorderInfo = function(){
	    var output = {};
	    output.width = this.getProperty('border-width') || 0;
	    output.style = this.getProperty('border-style') || 'none';
	    if (this.hasProperty('border-color')){
	        output.color = this.getProperty('border-color');
	    }
	    return output;
	};


    /**
     * Applies the attributes on the argument. The argument is supposed to be an instance of
     * [DOM.Element](https://developer.mozilla.org/en-US/docs/Web/API/element). In fact,
     * it is used only [setAttribute()](https://developer.mozilla.org/en-US/docs/Web/API/Element.setAttribute)
     * method of that instance. It
     * @method         decorateElement
     * @param          {DOM.Element}             elem
     * @return         {void}
     */
    this.decorateElement = function(elem){
    	if (typeof elem.setAttribute === 'function'){
			var summary = this.getCore(),
				keys = Object.keys(summary);
			keys.forEach(function(key){
				elem.setAttribute(key, summary[key]);
			});
    	}
    };

    /**
     * Sets key `width` inside {{#crossLink "Poroperties/_core:property"}}_core{{/crossLink}}
     * as well as key `width` inside `style` of {{#crossLink "Poroperties/_core:property"}}_core{{/crossLink}}.
     * @method         setWidth
     * @param          {Number|String}      w
     * @since          0.0.5
     */
    this.setWidth = function(w){
    	this.initializeStyle();
    	this.setProperty('width', w);
    	this.setStyleProperty('width', w);
    	// this.setStyleProperty('max-width', w);
    	// this.setStyleProperty('min-width', w);
    };


    /**
     * Returns value of key `width` of the instance: first looks up key `width` inside
     * styles and if it is not present there, looks it up among attributes.
     * @method         getWidth
     * @return         {Number|String}      w
     * @since          0.0.5
     */
    this.getWidth = function(){
    	var propName = 'width';
    	if (this.hasStyleProperty(propName)){
    		return this.getStyleProperty(propName);
    	}
    	if (this.hasProperty(propName)){
    		return this.getProperty(propName);
    	}
    };

    /**
     * Loads properties from the node attributes into the current instance. Each property value is
     * attempted to be converted into a number and if this operation succeeds, that number is inserted
     * as key value.
     *
     * In fact, it uses {{#crossLink "Properties/load:method"}}load{{/crossLink}} method which is
     * called with node `n` attributes in case they are present.
     * @method        loadNodeProperties
     * @param         {DOM.Node}            n
     * @return        {void}
     */
    this.loadNodeProperties = function(n){
    	var attrs = n.attributes;
    	if (attrs){
    		this.load(attrs);
    	}
    };

    /**
     * Set border-related attributes.
     *
     * It sets key `border` of {{#crossLink "Properties/core:property"}}core{{/crossLink}}
     * as well as keys `border-width`, `border-color` and `border-style` of `style` key of
     * {{#crossLink "Properties/core:property"}}core{{/crossLink}}.
     *
     * Argument `borderInfo` is supposed to have the following keys:
     * <ul><li>
     * `width` - to set width of the border. If not provided, default value 1 is used.
     * </li><li>
     * `color` - to set border color. If not set, default value '#000001' is used.
     * </li><li>
     * `style` - to set border style (solid, dashed etc). If not set, default value 'solid' is used.
     * </li></ul>
     * @method         setBorder
     * @param          {Object}     borderInfo        json object containing 'width', 'color' and 'style' of the border.
     * @return         {void}
     * @since          0.0.6
     */
    this.setBorder = function(borderInfo){
    	var bw, bc, bs,
    		defaultWidth = 1,
    		defaultColor = '#000001',
    		defaultStyle = 'solid';
    	if (borderInfo === undefined){
    		borderInfo = {'width': defaultWidth, 'color': defaultColor, 'style': defaultStyle};
    	}
    	bw = borderInfo.width || defaultWidth;
    	bc = borderInfo.color || defaultColor;
    	bs = borderInfo.style || defaultStyle;

    	this.setStyleProperty('border-width', bw);
    	this.setStyleProperty('border-color', bc);
    	this.setStyleProperty('border-style', bs);
    	this.setProperty('border', bw);
    };

    /**
     * Returns object containing information about border.
     *
     * Format of the returned object:
     * <code> {style: ... [, width: ...[, color: ...]]}</code>
     * If `style` key is set to `none`, then `width` and `color` might be not set. If `width` is not
     * set or equal to zero, then `color` might be not set.
     *
     * @method  getBorder
     * @return  {Object}
     * @since   0.0.6
     */
    this.getBorder = function(){
    	var result = {},
    		bs = 'border-style',
    		bw = 'border-width',
    		bc = 'border-color';
    	result.style = this.hasStyleProperty(bs) ? this.getStyleProperty(bs) : 'none';
    	if (result.style !== 'none'){
    		result.width = this.hasStyleProperty(bw) ? this.getStyleProperty(bw) : 0;
    		if (result.width !== 0 && this.hasStyleProperty(bc)){
    			result.color = this.getStyleProperty(bc);
    		}
    	}
    	return result;
    };

    /**
     * Drops border-related attributes.
     *
     * Removes attributes `border-width`, `border-color` and sets `border-style` to `none` in `style` key of
     * {{#crossLink "Properties/core:property"}}core{{/crossLink}}.
     *
     * Removes as well `border` attribute from {{#crossLink "Properties/core:property"}}core{{/crossLink}}.
     * @method         removeBorder
     * @since          0.0.6
     * @return         {void}
     */
    this.removeBorder = function(){
		if (this.hasStyleProperty('border-width')) {
			this.dropStyleProperty('border-width');
		}
		if (this.hasStyleProperty('border-color')) {
			this.dropStyleProperty('border-color');
		}
    	this.setStyleProperty('border-style', 'none');

    	if (this.hasProperty('border')) {
    		this.dropProperty('border');
    	}
    };

    /**
     * Shrinks width attribute by `d`.
     *
     * If width attribute exists and
     * <ul><li>
     * `d` is a number, then absolute value of width attribute gets descreased by `d`.
     * </li><li>
     * `d` is a string, then width key gets descreased by `d` both values have the same measure. Otherwise,
     * an error is thrown.
     * </li></ul>
     * @method         shrinkBy
     * @param          {String|Number}    d
     * @return         {void}
     * @uses           {Unit}             Unit class to perform calculations on values with unit of measurement.
     */
    this.shrinkBy = function(d){
    	if (d === undefined || !this.hasProperty('width')){
    		return;
    	}
    	var w = new Unit(this.getWidth());
    	if (typeof d === 'number'){
    		var val = w.getValue() - d;
    		this.setWidth(val);
    		return;
    	}
    	if (typeof d === 'string'){
    		var dU = new Unit(d),
    			 wF;
    		try {
    			wF = w.sub(dU);
    		} catch(e){
    			throw new Error('Can not shrink: units of measurement do not coincide.');
    		}
    		this.setWidth(wF.getValue());
    	}
    };

    /**
     * Returns json object collecting properties of the instance.
     *
     * The difference with {{#crossLink "Properties/getCore:method"}}getCore{{/crossLink}} method is that this method
     * is recursively applied to key `style` (since the corresponding value is an instance of this class) hence
     * output is a json object which values are strings, numbers or json objects but not functions or
     * other class instances.
     * @method         template
     * @return         {Object}
     * @since          0.2.1
     */
    this.template = function(){
    	var allowedTypes = ['string', 'number'];  // key values of these types are added
    											  // to the output without calling this method
    											  // recursively
    	var coreTmp = this.getCore(),
    		output = {},
    		keys, value, obj, i, len;

    	if (typeof coreTmp !== 'object'){
    		return output;
    	}
    	keys = Object.keys(coreTmp);
    	len = keys.length;
    	for (i = 0; i < len; i++){
    		value = coreTmp[keys[i]];
    		if (allowedTypes.indexOf(typeof value) !== -1){
    			output[keys[i]] = value;
    		} else if (value instanceof Properties){
    			obj = value.template();
    			if (Object.keys(obj).length > 0){
    				output[keys[i]] = obj;
    			}
    		}
    	}
    	return output;
    };
}

/**
 * Mode corresponding to attribute-like representation.
 * @property    {Integer} MODE_ATTRIBUTE
 * @type        {Integer}
 * @static
 * @final
 * @since       0.2.1
 */
Object.defineProperty(Properties, 'MODE_ATTRIBUTE', {
	value:  0,
	writable: false
});

/**
 * Mode corresponding to inline style representation.
 * @property    {Integer} MODE_STYLE
 * @type        {Integer}
 * @static
 * @final
 * @since       0.2.1
 */
Object.defineProperty(Properties, 'MODE_STYLE', {
	value: 1,
	writable: false
});

/**
 * Separator between subsequent key-value pairs
 * @property    {String}     SEPARATOR_RECORDS
 * @type        {String}
 * @static
 * @final
 * @since       0.2.2
 */
Object.defineProperty(Properties, 'SEPARATOR_RECORDS', {
	value: ';',
	writable: false
});


/**
 * Separator between key and value within
 * @property    {String}     SEPARATOR_KEY_VALUE
 * @type        {String}
 * @static
 * @final
 * @since       0.2.2
 */
Object.defineProperty(Properties, 'SEPARATOR_KEY_VALUE', {
	value: ':',
	writable: false
});