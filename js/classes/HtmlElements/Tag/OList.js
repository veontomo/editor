/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global List */

/**
 * This class is used to represent ordered lists.
 * @module 	    HtmlElements
 * @class  		OList
 * @constructor
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
	 * @property   {String}     tag
	 * @type       {String}
	 * @default    "ul"
	 */
	this.tag = 'ol';

	/**
	 * Returns the class name.  This property is introduced for compatibility with IE: i.e.
	 * in FF, `this.constructor` has `name` property that returns "OList", while in IE, there
	 * is no `name` property.
	 * @property {String}    className
	 * @type     {String}
	 * @default  "OList"
	 */
	this.className = 'OList';
}
OList.prototype = Object.create(List.prototype);