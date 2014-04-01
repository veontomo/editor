/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global List */

/**
 * This class is used to represent ordered lists.
 * @module 	    HtmlElements
 * @class  		OList
 * @extends     List
 * @since       0.0.2
 */
function OList() {
	"use strict";
	if (!(this instanceof OList)) {
		return new OList();
	}
	// inherit List properties
	List.call(this);

	/**
	 * Html tag corresponding to OList object.
	 * @property   {String}     name
	 * @type       {String}
	 * @default    "ul"
	 */
	this.name = 'ol';

	/**
	 * Returns the class name.  This property is introduced for compatibility with IE: i.e.
	 * in FF, `this.constructor.name` returns "List", while IE, it returns "undefined".
	 * This property must be overridden in all inherited classes.
	 * @property {String}    className
	 * @type     {String}
	 * @default  "List"
	 */
	this.className = 'OList';
}
OList.prototype = Object.create(List.prototype);