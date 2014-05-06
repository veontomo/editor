/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global Attributes, Cell, Row, Table */

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
	 * Re-set private properties defined in parent class {{#crossLink "Table"}}Table{{/crossLink}}:
	 * <ol><li>
	 * {{#crossLink "Tag/className:property"}}className{{/crossLink}} to be "FramedTable"
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
	 * {{#crossLink "FramedTable/phantomCellStyles:property"}}phantomCellStyles{{/crossLink}} getter.
	 * @method         getPhantomCellStyles
	 * @return         {Styles}
	 */
	this.getPhantomCellStyles = function(){
		return phantomCell.getStyles();
	};

	/**
	 * {{#crossLink "FramedTable/phantomCellStyles:property"}}phantomCellStyles{{/crossLink}} setter.
	 * @method         getPhantomCellStyles
	 * @param          {Any}             stl
	 * @return         {void}
	 */
	this.setPhantomCellStyles = function(stl){
		if (stl !== undefined){
			if (stl instanceof Styles){
				phantomCell.setStyles(stl);
			} else {
				phantomCell.setStyles(new Styles(stl));
			}
		}
	};

	/**
	 * {{#crossLink "FramedTable/phantomRowStyles:property"}}phantomRowStyles{{/crossLink}} getter.
	 * @method         getPhantomRowStyles
	 * @return         {Styles}
	 */
	this.getPhantomRowStyles = function(){
		return phantomRow.getStyles();
	};

	/**
	 * {{#crossLink "FramedTable/phantomRowStyles:property"}}phantomRowStyles{{/crossLink}} setter.
	 * @method         getPhantomCellStyles
	 * @param          {Styles}             stl
	 * @return         {void}
	 */
	this.setPhantomRowStyles = function(stl){
		if (stl !== undefined){
			if (stl instanceof Styles){
				phantomRow.setStyles(stl);
			} else {
				phantomRow.setStyles(new Styles(stl));
			}
		}
	};

	/**
	 * {{#crossLink "FramedTable/phantomTableStyles:property"}}phantomTableStyles{{/crossLink}} getter.
	 * @method         getPhantomTableStyles
	 * @return         {Styles}
	 */
	this.getPhantomTableStyles = function(){
		return phantomTable.getStyles();
	};

	/**
	 * {{#crossLink "FramedTable/phantomTableStyles:property"}}phantomTableStyles{{/crossLink}} setter.
	 * @method         setPhantomTableStyles
	 * @param          {Styles}                stl
	 * @return         {void}
	 */
	this.setPhantomTableStyles = function(stl){
		if (stl !== undefined){
			if (stl instanceof Styles){
				phantomTable.setStyles(stl);
			} else {
				phantomTable.setStyles(new Styles(stl));
			}
		}
	};

	/**
	 * {{#crossLink "FramedTable/phantomCellAttributes:property"}}phantomCellAttributes{{/crossLink}} getter.
	 * @method         getPhantomCellAttributes
	 * @return         {Attributes}
	 */
	this.getPhantomCellAttributes = function(){
		/// !!! stub
	};

	/**
	 * {{#crossLink "FramedTable/phantomCellAttributes:property"}}phantomCellAttributes{{/crossLink}} setter.
	 * @method         getPhantomCellAttributes
	 * @param          {Properties}             attr
	 * @return         {void}
	 */
	this.setPhantomCellAttributes = function(attr){
		/// !!! stub
	};

	/**
	 * {{#crossLink "FramedTable/phantomRowAttributes:property"}}phantomRowAttributes{{/crossLink}} getter.
	 * @method         getPhantomRowAttributes
	 * @return         {Attributes}
	 */
	this.getPhantomRowAttributes = function(){
		/// !!! stub
	};

	/**
	 * {{#crossLink "FramedTable/phantomRowAttributes:property"}}phantomRowAttributes{{/crossLink}} setter.
	 * @method         getPhantomCellAttributes
	 * @param          {Properties}         attr
	 * @return         {void}
	 */
	this.setPhantomRowAttributes = function(attr){
		/// !!! stub
	};

	/**
	 * {{#crossLink "FramedTable/phantomTableAttributes:property"}}phantomTableAttributes{{/crossLink}} getter.
	 * @method         getPhantomTableAttributes
	 * @return         {Attributes}
	 */
	this.getPhantomTableAttributes = function(){
		/// !!! stub
	};

	/**
	 * {{#crossLink "FramedTable/phantomTableAttributes:property"}}phantomTableAttributes{{/crossLink}} setter.
	 * @method         setPhantomTableAttributes
	 * @param          {Properties}         attr
	 * @return         {void}
	 */
	this.setPhantomTableAttributes = function(attr){
		/// !!! stub
	};




}
FramedTable.prototype = Object.create(Table.prototype);