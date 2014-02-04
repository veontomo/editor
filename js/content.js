/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global DOMParser, Node */

/**
 * This class is used to encompass other objects.
 * @module 	    HtmlElements
 * @class  		Content
 * @param 		{String} 	str 		an optional argument that will be inserted when creating property "elements".
 */
function Content(str) {
	"use strict";
	if (!(this instanceof Content)) {
		return new Content(str);
	}
	/**
	 * Container of items. If an item has a method "toHtml", it will be applied when transforming the whole Content object into a string.
	 * @property {Array} elements
	 * @default  [str]
	 */
	this.elements = str ? [str] : [];

	/**
	 * The number of items in the "elements" property
	 * @method length
	 * @return {Integer}
	 */
	this.length = function () {
		return this.elements.length;
	};

	/**
	 * Appends the element to the array Content::elements.
	 * @param  {Object}       elem
	 * @return {void}
	 */
	this.appendElem = function(elem){
		this.elements.push(elem);
	};
	/**
	 * Transforms the object into html form.  If item of the "elements" property is of Object type, then it should have "toHtml" method which is to be applied to the item.
	 * @method toHtml
	 * @return {String}
	 */
	this.toHtml = function () {
		var i, elem, output = '',
			len = this.length();
		for (i = 0; i < len; i++) {
			elem = this.elements[i];
			switch (typeof elem) {
			case 'string':
				output += elem;
				break;
			case 'number':
				output += elem.toString();
				break;
			case 'object':
				output += elem.hasOwnProperty('toHtml') ? elem.toHtml() : '<!-- no html representation -->';
				break;
			}
		}
		return output;
	};
}