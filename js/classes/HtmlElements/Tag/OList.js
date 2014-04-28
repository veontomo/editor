/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global List */

/**
 * This class is used to represent ordered lists.
 * @module 	           HtmlElements
 * @class  		       OList
 * @constructor
 * @extends            List
 * @since              0.0.2
 */
function OList() {
	"use strict";
	if (!(this instanceof OList)) {
		return new OList();
	}
	// inherit List properties
	List.call(this);

	/**
	 * Re-set private properties defined in parent class {{#crossLink "Tag"}}Tag{{/crossLink}}:
	 * <ol><li>
	 * {{#crossLink "Tag/tag:property"}}tag{{/crossLink}} to be "ol"
	 * </li><li>
	 * {{#crossLink "Tag/className:property"}}className{{/crossLink}} to be "OList"
	 * </li></ol>
	 * @method         constructor
	 */
	this.setTag('ol');
	this.setName('OList');

}
OList.prototype = Object.create(List.prototype);