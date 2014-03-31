/*jslint plusplus: true, white: true */
/*global  */

/**
 * Service locator for the classes present in the application.
 * @module  Helper
 * @class  Registry
 * @since  0.0.2
 * @author A.Shcherbakov
 */
function Registry(){
	"use strict";
	if (!(this instanceof Registry)) {
		return new Registry();
	}

	/**
	 * Names of all classes to be observed.
	 * @property {Array} classes                array of class names
	 * @type {Array}
	 */
	this.classes = ["Tag", "Table", "Row", "Cell", "Link", "List", "ListItem", "Text"];

	/**
	 * Object of key-value pairs the form `className: tags`, where `tags` is an array of tag names that class `className`
	 * can represent.<br />
	 * For example, `{'Cell': ['td'], 'List': ['ul', 'ol'], ...}`
	 * @property {Object}   map
	 */
	this.map = (function(arr){
		var obj = {};
		arr.forEach(function(cName){
			var phantom = new window[cName]();
			if (phantom.allowedNames){
				obj[cName] = phantom.allowedNames;
			} else if (phantom.name){
				obj[cName] = [phantom.name];
			}
		});
		return obj;
	}(this.classes));

}