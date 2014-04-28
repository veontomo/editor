/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global List */

/**
 * This class is used to represent unordered lists.
 * @module 	           HtmlElements
 * @class  		       UList
 * @constructor
 * @extends            List
 * @since              0.0.2
 */
function UList() {
	"use strict";
	if (!(this instanceof UList)) {
		return new UList();
	}
	// inherit List properties
	List.call(this);

	/**
	 * Re-set private properties defined in parent class {{#crossLink "Tag"}}Tag{{/crossLink}}:
	 * <ol><li>
	 * {{#crossLink "Tag/tag:property"}}tag{{/crossLink}} to be "ul"
	 * </li><li>
	 * {{#crossLink "Tag/className:property"}}className{{/crossLink}} to be "UList"
	 * </li></ol>
	 * @method         constructor
	 */
	this.setTag('ul');
	this.setName('UList');

}
UList.prototype = Object.create(List.prototype);