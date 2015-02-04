/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global TableCellStyles, Content, Tag */

/**
 * Represents a table cell. The argument is supposed to be passed to the "content" property.
 * @module             HtmlElements
 * @class              Cell
 * @constructor
 * @param              {mixed}              arg
 */
function Cell(arg) {
	"use strict";
	if (!(this instanceof Cell)) {
		return new Cell(arg);
	}
	// inherit tag properties
	Tag.call(this, arg);

	/**
	 * Re-set private properties defined in parent class {{#crossLink "Tag"}}Tag{{/crossLink}}:
	 * <ol><li>
	 * {{#crossLink "Tag/tag:property"}}tag{{/crossLink}} to be "td"
	 * </li><li>
	 * {{#crossLink "Tag/className:property"}}className{{/crossLink}} to be "Cell"
	 * </li><li>
	 * {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}} to be
	 * {{#crossLink "CellProperties"}}TableCellStyles{{/crossLink}}
	 * </li><li>
	 * {{#crossLink "Tag/content:property"}}content{{/crossLink}} accepts current class argument.
	 * </li></ol>
	 * @method         constructor
	 */
	this.setTag('td');
	this.setName('Cell');
	this.setProperties(new CellProperties());
	this.setContent(new Content(arg));
}

Cell.prototype = Object.create(Tag.prototype);

/**
 * {{#crossLink "Cell"}}Cell{{/crossLink}}'s class characteristic function.
 *
 * It returns `true` if the argument "corresponds" to an object which class Link is designed
 * to represent.
 * @method        characteristicFunction
 * @param         {Any}               n
 * @return        {Boolean}
 * @since         0.2.0
 */
Cell.prototype.characteristicFunction = function(n){
	return (n instanceof Element) && n.tagName.toLowerCase() === 'td';
};