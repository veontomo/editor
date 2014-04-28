/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global TableCellStyles, Content, Tag */

/**
 * Represents a table cell. The argument is supposed to be passed to the "content" property.
 * @module          HtmlElements
 * @class           Cell
 * @constructor
 * @param           {mixed} arg
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
	 * {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} to be
	 * {{#crossLink "TableCellStyles"}}TableCellStyles{{/crossLink}}
	 * </li><li>
	 * {{#crossLink "Tag/content:property"}}content{{/crossLink}} accepts current class argument.
	 * </li></ol>
	 * @method         constructor
	 */
	this.setTag('td');
	this.setName('Cell');
	this.setStyles(new TableCellStyles());
	this.setContent(new Content(arg));


}
Cell.prototype = Object.create(Tag.prototype);