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
	 * A {{#crossLink "Cell"}}Cell{{/crossLink}} instance that collects {{#crossLink "Styles"}}styles{{/crossLink}}
	 * and {{#crossLink "Attributes"}}attributes{{/crossLink}}. Its {{#crossLink "Content"}}content{{/crossLink}} is
	 * ignored.
	 * @property       {Cell}               phantomCell
	 * @type           {Cell}
	 * @private
	 */
	var phantomCell = new Cell();

	/**
	 * A {{#crossLink "Row"}}Row{{/crossLink}} instance that collects {{#crossLink "Styles"}}styles{{/crossLink}}
	 * and {{#crossLink "Attributes"}}attributes{{/crossLink}}. Its {{#crossLink "Content"}}content{{/crossLink}} is
	 * ignored.
	 * @property       {Row}                phantomRow
	 * @type           {Row}
	 * @private
	 */
	var phantomRow = new Row();

	/**
	 * A {{#crossLink "Table"}}Table{{/crossLink}} instance that collects {{#crossLink "Styles"}}styles{{/crossLink}}
	 * and {{#crossLink "Attributes"}}attributes{{/crossLink}}. Its {{#crossLink "Content"}}content{{/crossLink}} is
	 * ignored.
	 * @property       {Table}              phantomTable
	 * @type           {Table}
	 * @private
	 */
	var phantomTable = new Table();


	/**
	 * {{#crossLink "FramedTable/phantomCell:property"}}phantomCell{{/crossLink}} getter.
	 * @method         getPhantomCellStyles
	 * @return         {Styles}
	 */
	this.getPhantomCellStyles = function(){
		/// !!! stub
	}

	/**
	 * {{#crossLink "FramedTable/phantomCell:property"}}phantomCell{{/crossLink}} setter.
	 * @method         getPhantomCellStyles
	 * @param          {stl}                stl
	 * @return         {void}
	 */
	this.setPhantomCellStyles = function(stl){
		/// !!! stub
	}

	/**
	 * {{#crossLink "FramedTable/phantomRow:property"}}phantomRow{{/crossLink}} getter.
	 * @method         getPhantomRowStyles
	 * @return         {Styles}
	 */
	this.getPhantomRowStyles = function(){
		/// !!! stub
	}

	/**
	 * {{#crossLink "FramedTable/phantomRow:property"}}phantomRow{{/crossLink}} setter.
	 * @method         getPhantomCellStyles
	 * @param          {stl}                stl
	 * @return         {void}
	 */
	this.setPhantomRowStyles = function(stl){
		/// !!! stub
	}

	/**
	 * {{#crossLink "FramedTable/phantomTable:property"}}phantomTable{{/crossLink}} getter.
	 * @method         getPhantomTableStyles
	 * @return         {Styles}
	 */
	this.getPhantomTableStyles = function(){
		/// !!! stub
	}

	/**
	 * {{#crossLink "FramedTable/phantomTable:property"}}phantomTable{{/crossLink}} setter.
	 * @method         setPhantomTableStyles
	 * @param          {stl}                stl
	 * @return         {void}
	 */
	this.setPhantomTableStyles = function(stl){
		/// !!! stub
	}



}
FramedTable.prototype = Object.create(Table.prototype);