/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global List */

/**
 * This class is used to represent unordered lists.
 * @module 	    HtmlElements
 * @class  		UList
 * @extends     List
 * @since       0.0.2
 */
function UList() {
	"use strict";
	if (!(this instanceof UList)) {
		return new UList();
	}
	// inherit List properties
	List.call(this);

	/**
	 * Html tag corresponding to UList object.
	 * @property   {String}     name
	 * @type       {String}
	 * @default    "ul"
	 */
	this.name = 'ul';

	/**
	 * Returns the class name.  This property is introduced for compatibility with IE: i.e.
	 * in FF, `this.constructor.name` returns "List", while IE, it returns "undefined".
	 * This property must be overridden in all inherited classes.
	 * @property {String}    className
	 * @type     {String}
	 * @default  "List"
	 */
	this.className = 'UList';
}
UList.prototype = Object.create(List.prototype);