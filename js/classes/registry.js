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
	'use strict';
	if (!(this instanceof Registry)) {
		return new Registry();
	}

	/**
	 * Names of all classes to be observed.
	 * @property {Array} classes                array of class names
	 * @type {Array}
	 */
	this.classes = ['Table', 'Row', 'Cell', 'Link', 'UList', 'OList',  'ListItem', 'Text'];

	/**
	 * Object of key-value pairs the form `className: tag`, where `tag` is a tag name that class `className`
	 * represent.<br />
	 * For example, `{'Cell': 'td', 'UList': 'ul', ...}`
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