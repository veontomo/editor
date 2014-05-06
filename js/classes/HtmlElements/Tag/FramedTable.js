/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global Attributes, Cell, Row, Tag */

/**
* Represents table.
* @module              HtmlElements
* @class               FramedTable
* @constructor
* @extends             Table
*/
function FramedTable() {
	"use strict";
	if (!(this instanceof FramedTable)) {
		return new FramedTable();
	}
	// inherit tag properties
	Table.call(this);


	/**
	 * Re-set private properties defined in parent class {{#crossLink "Tag"}}Tag{{/crossLink}}:
	 * <ol><li>
	 * {{#crossLink "Tag/className:property"}}className{{/crossLink}} to be "Table"
	 * </li></ol>
	 * @method         constructor
	 */
	this.setName('FramedTable');


	/**
	 * Phantom {{#crossLink "Cell"}}Cell{{/crossLink}} serves to collect {{#crossLink "Styles"}}styles{{/crossLink}}
	 * and {{#crossLink "Attributes"}}attributes{{/crossLink}}. Its {{#crossLink "Content"}}content{{/crossLink}} is
	 * ignored.
	 * @property       {Cell}               phantomCell
	 * @type           {Cell}
	 * @private
	 */
	var phantomCell = new Cell();

	/**
	 * Phantom {{#crossLink "Row"}}Row{{/crossLink}} serves to collect {{#crossLink "Styles"}}styles{{/crossLink}}
	 * and {{#crossLink "Attributes"}}attributes{{/crossLink}}. Its {{#crossLink "Content"}}content{{/crossLink}} is
	 * ignored.
	 * @property       {Row}                phantomRow
	 * @type           {Row}
	 * @private
	 */
	var phantomRow = new Row();

	/**
	 * Phantom {{#crossLink "Table"}}Table{{/crossLink}} serves to collect {{#crossLink "Styles"}}styles{{/crossLink}}
	 * and {{#crossLink "Attributes"}}attributes{{/crossLink}}. Its {{#crossLink "Content"}}content{{/crossLink}} is
	 * ignored.
	 * @property       {Table}              phantomTable
	 * @type           {Table}
	 * @private
	 */
	var phantomTable = new Table();

}
FramedTable.prototype = Object.create(Table.prototype);