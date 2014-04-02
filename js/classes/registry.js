/*jslint plusplus: true, white: true */
/*global window */

/**
 * Service locator for the classes present in the application. The argument is an object containing the following keys:
 * <ol>
 * <li>`classes` - array of classes, each of these classes should have non-empty string-valued
 * `name` property (to be its html tag) </li>
 * <li>`default` - default class (to be used for construction of objects which html tag is not present among
 * `name` property in the available classes)</li>
 * </ol>
 * @module  Helper
 * @class   Registry
 * @param   {Object}       info     object
 * @since   0.0.2
 * @author  A.Shcherbakov
 */
function Registry(info){
	'use strict';
	if (!(this instanceof Registry)) {
		return new Registry(info);
	}
	var obj = info || {};

	/**
	 * Returns `true`, if the the argument is a class with non-empty string-valued `name` property.
	 * Otherwise, `false` is returned.
	 * @method  hasValidName
	 * @return    {Boolean}
	 */
	this.hasValidName = function(cl){
		if (typeof cl === 'function'){
			var objName = (new cl).name;
			return (typeof objName === 'string' && objName !== '');
		}
		return  false;
	};

	/**
	 * Array of classes to be observed. If an array element turns out to be not a function ( = class), then this
	 * element is ignored. Duplicates are ignored as well.
	 * @property   classes
	 * @type       {Array}
	 */
	this.classes = (function(arr, context){
		var output = [];
		arr.forEach(function(cl){
			if (context.hasValidName(cl) && output.indexOf(cl) === -1){
				output.push(cl);
			}
		});
		return output;
	}(obj.classes || [], this));

	/**
	 * A class to construct an object if object-tag-name is not among the `name`
	 * property of the {{#crossLink "Registry/classes:property"}}`classes`{{/crossLink}}.
	 * The `name` property of this class instances is to be set explicitely
	 * upon instantiating. If at initialization time, the constructor recieves an input such that `info.defaultClass`
	 * is not a function, then it is set to `null`.
	 * @property defaultClass
	 * @type     {Function|Null}
	 */

	this.defaultClass = typeof obj.defaultClass === 'function' ? obj.defaultClass : null;

	/**
	 * Returns class from {{#crossLink "Registry/classes:property"}}classes{{/crossLink}} which `name` property
	 * is equal to the argument. If there is no such a class, the default one
	 * {{#crossLink "Registry/defaultClass:property"}}defaultClass{{/crossLink}}  is returned.
	 * @method    classForTag
	 * @param     {String}     tag
	 * @return    {Function}
	 */
	this.classForTag = function(tag){
		var output = this.map[tag];
		return output || this.defaultClass;
	}

	/**
	 * Object of key-value pairs the form `tag: className`, where `tag` is a tag name that class `className`
	 * represent.<br />
	 * For example, `{'td': 'Cell', 'ul': 'UList', ...}`
	 * @property    map
	 * @type        {Array}
	 */
	this.map = (function(arr){
		var output = {};
		arr.forEach(function(cName){
			var phantom = new cName;
			output[phantom.name] = cName;
		});
		return output;
	}(this.classes));

	/**
	 * Adds the argument into the array {{#crossLink "Registry/classes:property"}}`classes`{{/crossLink}} and update
	 * object {{#crossLink "Registry/map:property"}}`map`{{/crossLink}} if the method
	 * {{#crossLink "Registry/hasValidName:method"}}`hasValidName`{{/crossLink}} returns `true` for that argument.
	 * @method  register
	 * @param  {Function}    cName
	 * @return {Boolean}
	 */
	this.register = function(cName){
		if (this.hasValidName(cName) && this.classes.indexOf(cName) === -1){
			var phantomName = (new cName).name;
			this.classes.push(cName);
			this.map[phantomName] = cName;
			return true;
		}
		return false;
	};

	/**
	 * If the argument is present among {{#crossLink "Registry/classes:property"}}classes{{/crossLink}},
	 * then remove it from there and from {{#crossLink "Registry/map:property"}}map{{/crossLink}} and
	 * return `true`. Otherwise, `false` is returned.
	 * @method   unregister
	 * @param    {mixed}         cName                Supposed to be of function type, since namely only
	 *                                                functions are present in
	 *                                                {{#crossLink "Registry/classes:property"}}classes{{/crossLink}}
	 * @return {Boolean}
	 */
	this.unregister = function(cName){
		// stub
		var pos = this.classes.indexOf(cName);
		if (pos === -1){
			return false;
		}
		var name = (new cName).name;
		this.classes.splice(pos, 1);
		delete this.map[name];
		return true;
	};

}