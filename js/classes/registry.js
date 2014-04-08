/*jslint plusplus: true, white: true */
/*global window */

/**
 * Service locator for the classes present in the application. The argument is an object containing the following keys:
 * <ol>
 * <li>`classes` - array of classes, each of these classes should have non-empty string-valued
 * `tag` property (to be its html tag) </li>
 * <li>`defaultClass` - default class (to be used for construction of objects which html tag is not present among
 * `tag` property in the available classes)</li>
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
	 * @method     hasValidTag
	 * @return     {Boolean}
	 */
	this.hasValidTag = function(cl){
		if (typeof cl === 'function'){
			var objName = (new cl).tag;
			return (typeof objName === 'string' && objName !== '');
		}
		return  false;
	};

	/**
	 * Array of classes to be observed. If an element from the input array `classes` turns out to be not a
	 * function (that is a class constructor), then this element is ignored. Duplicates are ignored as well.
	 * @property   classes
	 * @type       {Array}
	 */
	this.classes = (function(arr){
		var output = [];
		arr.forEach(function(cl){
			if ((typeof cl === 'function') && output.indexOf(cl) === -1){
				output.push(cl);
			}
		});
		return output;
	}(obj.classes || []));


	/**
	 * Parses
	 * @param  {[type]} className [description]
	 * @return {[type]}           [description]
	 */
	this.findClassByName = function(className){
		/// !!! stub
		return className;
	};

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
	 * @method    findClassByTag
	 * @param     {String}     tag
	 * @return    {Function}
	 */
	this.findClassByTag = function(tag){
		var output = this.tagMap[tag];
		return output || this.defaultClass;
	};

	/**
	 * Object of key-value pairs of the form `tag: class`, where `tag` is a tag name that `class`
	 * represents.<br />
	 * For example, `{'td': Cell, 'ul': UList, ...}`
	 * @property    tagMap
	 * @type        {Array}
	 */
	this.tagMap = (function(arr){
		var output = {};
		arr.forEach(function(Cname){
			var phantom = new Cname,
				phantomTag = phantom.tag;
			if (typeof phantomTag === 'string' && phantomTag !== ''){
				output[phantom.tag] = Cname;
			}
		});
		return output;
	}(this.classes));


	/**
	 * Object of key-value pairs of the form `name: class`, where `name` is a name of the `class`.
	 * For example, `{'Cell': Cell, 'ListItem': ListItem, ...}`
	 * @property    classNameMap
	 * @type        {Array}
	 */
	this.classNameMap = (function(arr){
		var output = {};
		arr.forEach(function(Cname){
			var phantom = new Cname,
				phantomClassName = phantom.className;
			if (typeof phantomClassName === 'string' && phantomClassName !== ''){
				output[phantomClassName] = Cname;
			}

		});
		return output;
	}(this.classes));

	/**
	 * If the argument is a class, then inserts  into the array {{#crossLink "Registry/classes:property"}}`classes`{{/crossLink}}
	 * and updates objects {{#crossLink "Registry/tagMap:property"}}`tagMap`{{/crossLink}} and
	 * {{#crossLink "Registry/classNameMap:property"}}`classNameMap`{{/crossLink}} if the class has non-empty string-valued
	 * properties `tag` and `className` respectively.
	 * @method  register
	 * @param  {Function}    cName
	 * @return {Boolean}
	 */
	this.register = function(Cname){
		if ((typeof Cname === 'function') && this.classes.indexOf(Cname) === -1){
			var phantomTag = (new Cname).tag,
				phantomClassName = (new Cname).className;
			this.classes.push(Cname);
			if (typeof phantomTag === 'string' && phantomTag !== ''){
				this.tagMap[phantomTag] = Cname;
			}
			if (typeof phantomClassName === 'string' && phantomClassName !== ''){
				this.classNameMap[phantomClassName] = Cname;
			}

			return true;
		}
		return false;
	};

	/**
	 * Returns `true`, if the argument is present among {{#crossLink "Registry/classes:property"}}classes{{/crossLink}}.
	 * Otherwise, `false` is returned.
	 * In addition, removes the argument from {{#crossLink "Registry/classes:property"}}classes{{/crossLink}}. Removes as
	 * well the corresponding information (if present) from {{#crossLink "Registry/tagMap:property"}}tagMap{{/crossLink}},
	 * {{#crossLink "Registry/classNameMap:property"}}classNameMap{{/crossLink}} and
	 * {{#crossLink "Registry/defaultClass:property"}}defaultClass{{/crossLink}}.
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
		this.classes.splice(pos, 1);
		if (this.defaultClass === cName){
			this.defaultClass = null;
		};
		var phantom = new cName,
			phantomTag = phantom.tag,
			phantomClassName = phantom.className;
		if (this.tagMap.hasOwnProperty(phantomTag)){
			delete this.tagMap[phantomTag];
		};
		if (this.classNameMap.hasOwnProperty(phantomClassName)){
			delete this.classNameMap[phantomClassName];
		};
		return true;
	};

}