/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global Attributes, Cell, Row, Table, Styles */

/**
* Represents framed table which is a table which rows contain only one cell inside which there is another table. These three
* elements - row, cell and table - are called phantom ones. Only {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} and
* {{#crossLink "Tag/attributes:property"}}attributes{{/crossLink}} of the phantom elements are of interest (
* {{#crossLink "Tag/content:property"}}content{{/crossLink}} is ignored - there is even no corresponding setter/getter).
*
* Below, dotted lines correspond to the phantom elements, solid - to "normal" ones.
* <span style="color: black">Black color corresponds to table</span>,
* <span style="color: orange">orange - to table row</span>,
* <span style="color: green">green - to table cell</span>.
* <style>
* .phantom, .normal{
*	border-width: 2px;
*	padding: 4px;
* 	margin: 4px;
*	border-collapse: separate;
* }
*
* .phantom {
* 	border-style: dashed;
* }
* .normal {
*   border-style: solid;
* }
* table.phantom, table.normal {
*	border-color: #2818B1;
*	padding: 10px;
* }
* td.phantom, td.normal{
* 	border-color: #00A779;
* }
* tr.phantom, tr.normal {
* 	outline-width: 2px;
* 	outline-color: #FF9C00;
* }
* tr.phantom{
* 	outline-style: dashed;
* }
* tr.normal {
* 	outline-style: solid;
* }

* </style>
*
* <table class="normal">
* 	<tr class="phantom">
*  		<td class="phantom">
*  			<table class="phantom">
*  				<tr class="normal">
*  					<td class="normal">
*  						first cell of the first line
*  					</td>
*  					<td class="normal">
*  						second cell of the first line
*  					</td>
*  				</tr>
*  			</table>
*  		</td>
*   </tr>
* 	<tr class="phantom">
*  		<td class="phantom">
*  			<table class="phantom">
*  				<tr class="normal">
*  					<td class="normal">
*  						first cell of the second line
*  					</td>
*  					<td class="normal">
*  						second cell of the second line
*  					</td>
*  				</tr>
*  			</table>
*  		</td>
*   </tr>
* </table>
* @module              HtmlElements
* @class               FramedTable
* @constructor
* @extends             Tag
*/
function FramedTable() {
	"use strict";
	if (!(this instanceof FramedTable)) {
		return new FramedTable();
	}
	// inherit tag properties
	Tag.call(this);


	/**
	 * Re-set private properties defined in parent class {{#crossLink "Table"}}Table{{/crossLink}}:
	 * <ol><li>
	 * {{#crossLink "Tag/className:property"}}className{{/crossLink}} to be "FramedTable"
	 * </li><li>
	 * {{#crossLink "Tag/tagName:property"}}tagName{{/crossLink}} to be "table"
	 * </li></ol>
	 * @method         constructor
	 */
	this.setName('FramedTable');
	this.setTag('table');


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
		return phantomCell.getAttributes();
	};

	/**
	 * {{#crossLink "FramedTable/phantomCellAttributes:property"}}phantomCellAttributes{{/crossLink}} setter.
	 * @method         getPhantomCellAttributes
	 * @param          {Properties}             attr
	 * @return         {void}
	 */
	this.setPhantomCellAttributes = function(attr){
		if (attr !== undefined){
			if (attr instanceof Attributes){
				phantomCell.setAttributes(attr);
			} else {
				phantomCell.setAttributes(new Attributes(attr));
			}
		}
	};

	/**
	 * {{#crossLink "FramedTable/phantomRowAttributes:property"}}phantomRowAttributes{{/crossLink}} getter.
	 * @method         getPhantomRowAttributes
	 * @return         {Attributes}
	 */
	this.getPhantomRowAttributes = function(){
		return phantomRow.getAttributes();
	};

	/**
	 * {{#crossLink "FramedTable/phantomRowAttributes:property"}}phantomRowAttributes{{/crossLink}} setter.
	 * @method         getPhantomCellAttributes
	 * @param          {Properties}         attr
	 * @return         {void}
	 */
	this.setPhantomRowAttributes = function(attr){
		if (attr !== undefined){
			if (attr instanceof Attributes){
				phantomRow.setAttributes(attr);
			} else {
				phantomRow.setAttributes(new Attributes(attr));
			}
		}
	};

	/**
	 * {{#crossLink "FramedTable/phantomTableAttributes:property"}}phantomTableAttributes{{/crossLink}} getter.
	 * @method         getPhantomTableAttributes
	 * @return         {Attributes}
	 */
	this.getPhantomTableAttributes = function(){
		return phantomTable.getAttributes();
	};

	/**
	 * {{#crossLink "FramedTable/phantomTableAttributes:property"}}phantomTableAttributes{{/crossLink}} setter.
	 * @method         setPhantomTableAttributes
	 * @param          {Properties}         attr
	 * @return         {void}
	 */
	this.setPhantomTableAttributes = function(attr){
		if (attr !== undefined){
			if (attr instanceof Attributes){
				phantomTable.setAttributes(attr);
			} else {
				phantomTable.setAttributes(new Attributes(attr));
			}
		}
	};


	/**
	 * Creates html representation.
	 * @method         toHtml
	 * @return         {String}
	 */
	this.toHtml = function(){
		var phTableAttrStr = this.getPhantomTableAttributes().toString(),
			phTableStlStr = this.getPhantomTableStyles().toString(),
			phRowStlStr = this.getPhantomRowStyles().toString(),
			phRowAttrStr = this.getPhantomRowAttributes().toString(),
			phCellStlStr = this.getPhantomCellStyles().toString(),
			phCellAttrStr = this.getPhantomCellAttributes().toString(),
			stlStr = this.getStyles().toString(),
			attrStr = this.getAttributes().toString(),
			phRowTag = phantomRow.getTag(),
			phCellTag = phantomCell.getTag(),
			phTableTag = phantomTable.getTag(),
			currentTag = this.getTag(),
			output = '<' + [currentTag, attrStr, stlStr].join(' ')  + '>',
			phHead, phFoot;
		phHead  = '<' + [phRowTag, phRowAttrStr, phRowStlStr].join(' ') + '>';
		phHead += '<' + [phCellTag, phCellAttrStr, phCellStlStr].join(' ') + '>';
		phHead += '<' + [phTableTag, phTableAttrStr, phTableStlStr].join(' ') + '>';
		phFoot  = '</' + phTableTag + '></' + phCellTag + '></' + phRowTag + '>';

		this.getElements().forEach(function(el){
			output += phHead + el.toHtml() + phFoot;
		});

		output += '</' + currentTag + '>';
		return output;
	};
}
FramedTable.prototype = Object.create(Tag.prototype);