/*jslint plusplus: true, white: true */
/*global window */

/**
 * Service locator for the classes present in the application. The argument is an object containing the following keys:
 * <ol>
 * <li>`classes` - array of available class names, each of these classes should have non-empty string-valued
 * `name` property (to be its html tag) </li>
 * <li>`default` - default class name (to be used for construction of objects which html tag is not present among
 * `name` property in the available classes)</li>
 * </ol>
 * @module  Helper
 * @class  Registry
 * @param {Object}       info     object
 * @since  0.0.2
 * @author A.Shcherbakov
 */
function Registry(info){
	'use strict';
	if (!(this instanceof Registry)) {
		return new Registry(info);
	}
	var obj = info || {};

	/**
	 * Names of the classes to be observed. The classes must be defined. If corresponding class is not defined, then this
	 * array element is ignored. Duplicates are ignored as well.
	 * @property   classes
	 * @type       {Array}
	 */
	this.classes = (function(arr){
		var output = [];
		arr.forEach(function(cName){
			if (typeof window[cName] === 'function' && output.indexOf(cName)){
				output.push(cName);
			}
		});
		return output;
	}(obj.classes || []));

	/**
	 * Name of the default class. This class is used to construct an object if its tag name is not among the `name`
	 * property of the available classes. The `name` property of this class instances is to be set explicitely
	 * upon instantiating. The class must be defined. Otherwise, `null` is set.
	 * @property defaultClass
	 * @type     {String|Null}
	 */

	this.defaultClass = typeof window[obj.defaultClass] === 'function' ? obj.defaultClass : null;

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
			var phantom = new window[cName]();
			output[phantom.name] = cName;
		});
		return output;
	}(this.classes));

	/**
	 * If the class `cName` exists and has non-empty string valued property `name`, then the class name
	 * is added to the {{#crossLink "Registry/classes:property"}}`classes`{{/crossLink}} array and
	 * {{#crossLink "Registry/map:property"}}`map`{{/crossLink}} is augmented with the corresponding
	 * key-value pair.
	 * @param  {String}    cName
	 * @return {Boolean}
	 */
	this.register = function(cName){
		if (typeof window[cName] === 'function'){
			var phantomName = (new window[cName]()).name;
			if (typeof phantomName === 'string' && phantomName !== '' && this.classes.indexOf(cName) === -1){
				this.classes.push(cName);
				this.map[phantomName] = cName;
				return true;
			}
		}
		return false;
	};

}