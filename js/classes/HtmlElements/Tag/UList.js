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

/**
 * {{#crossLink "UList"}}UList{{/crossLink}}'s class characteristic function.
 *
 * It returns `true` if the argument "corresponds" to an object which class UList is designed
 * to represent.
 * @method        characteristicFunction
 * @param         {Any}               n
 * @return        {Boolean}
 * @since         0.2.0
 */
UList.prototype.characteristicFunction = function(n){
	return (n instanceof Element) && n.tagName.toLowerCase() === 'ul';
};