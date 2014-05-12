/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global Attributes, Cell, Table, TableRowStyles, Tag, Content */

/**
 * Represents a table row
 * @module      HtmlElements
 * @class       Row
 * @constructor
 * @extends     Tag
 */
function Row() {
	"use strict";
	if (!(this instanceof Row)) {
		return new Row();
	}
	// inherit tag properties
	Tag.call(this);

	/**
	 * Re-set private properties defined in parent class {{#crossLink "Tag"}}Tag{{/crossLink}}:
	 * <ol><li>
	 * {{#crossLink "Tag/tag:property"}}tag{{/crossLink}} to be "tr"
	 * </li><li>
	 * {{#crossLink "Tag/className:property"}}className{{/crossLink}} to be "Row"
	 * </li><li>
	 * {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} to be
	 * {{#crossLink "TableRowStyles"}}TableRowStyles{{/crossLink}}
	 * </li></ol>
	 * @method         constructor
	 */
	this.setTag('tr');
	this.setName('Row');
	this.setStyles(new TableRowStyles());

	/**
	 * Returns an array of absolute cell widths (widths without unit of measurement).
	 * @method         getCellWidths
	 * @return         {Array}
	 */
	this.getCellWidths = function(){
		var output = [],
			cellNum = this.cellNum(),
			i;
		for (i = 0; i < cellNum; i++){
			output.push(this.getElem(i).getWidthValue());
		}
		return output;
	};

	/**
	 * Alias for length() method of the parent class.
	 * @method         cellNum
	 * @return         {Number}
	 */
	this.cellNum = function(){
		return this.length();
	};

	/**
	 * Sets widths of the cells inside the row.
	 * @method         setCellWidths
	 * @param          {Array}              profile         each elements if this array is a width of the corresp. cell in the row.
	 * @return         {void}
	 */
	this.setCellWidths = function(profile){
		var len = profile.length,
			i;
		if (this.cellNum() !== len){
			throw new Error('Incompatible array length!');
		}
		for (i = 0; i < len; i++){
			this.getElem(i).setWidth(profile[i]);
		}
	};

	/**
	 * Inserts a cell into a given position. If the object to insert is a Cell instance,
	 * then parent method insertElemAt is called. Otherwise, an error is thrown.
	 * @method         insertCellAt
	 * @param          {Cell}               cell        a cell to insert. If not a Cell instance, an error will be thrown.
	 * @param          {Number}             pos         position at which the cell is to be inserted.
	 * @return         {void}
	 */
	this.insertCellAt = function(pos, cell){
		if (!(cell instanceof Cell)){
			throw new Error('Only a Cell instance is allowed for insertion!');
		}
		this.insertElemAt(pos, cell);
	};

	/**
	 * Appends a cell to the row cells. If one tries to append a non-Cell object, an exception is thrown.
	 * Otherwise, a method appendElem of the parent class is called.
	 * @method appendCell
	 * @param  {Cell}     cell            a cell to be appended. If not a Cell instance, an error is thrown.
	 * @return {void}
	 */
	this.appendCell = function(cell){
		if (!(cell instanceof Cell)){
			throw new Error('The argument is not a Cell instance!');
		}
		this.appendElem(cell);
	};

	/**
	 * Returns true if the row contains only one cell and this cell contains only one element
	 * that is a Table() instance. Otherwise, false is returned.
	 * @method         onlyTableInside
	 * @return         {Boolean}
	 */
	this.onlyTableInside = function(){
		var cell = this.getFirst();
		if (cell === undefined || this.cellNum() !== 1 || cell.length() !== 1){
			console.log('returning false ');
			return false;
		}
		console.log('onlyTableInside returning ', cell.getFirst() instanceof Table);
		return (cell.getFirst() instanceof Table);
	};

	/**
	 * Alias for {{#crossLink "Tag/dropElemAt:method"}}dropElemAt{{/crossLink}} method.
	 * @method         dropCellAt
	 * @param          {Number}             pos        index of the cell to de dropped out.
	 * @return         {void}
	 */
	this.dropCellAt = function(pos){
		this.dropElemAt(pos);
	};

	/**
	 * 12/02/2014 11:55: dropCell --> knockOutCell
	 * Drops the cell at the given position and resizes the remaining cells. If the cell is utmost left, the freed space is then
	 * assigned to its right neighbour:
     * |xxx| a | b   | c | -> |     a | b   | c |
     * | a |xxx| b   | c | -> | a |     b   | c |
	 * If there is no right neighbour, then it is assigned to the left one:
	 * | a | b | c | xxx | -> | a | b | c       |
	 * If the cell to delete does not exist, nothing is performed.
	 * @method         knockOutCell
	 * @param          {Number}             cellNum         cell number to delete. Numeration starts with 0.
	 * @return         {void}               after
	 */
	this.knockOutCell = function(cellNum){
		var acceptor, acceptorWidth, currentCell, currentCellWidth;
		if (cellNum < this.cellNum()){
			if (this.getElem(cellNum + 1)){
				acceptor = this.getElem(cellNum + 1);
			} else {
				if (this.getElem(cellNum - 1)){
				acceptor = this.getElem(cellNum - 1);
				}
			}
			if (acceptor){
				acceptorWidth = acceptor.getWidth();
				currentCell = this.getElem(cellNum);
				currentCellWidth = currentCell.getWidth();
				acceptor.setWidth(acceptorWidth + currentCellWidth);
			}
			this.dropElemAt(cellNum);
		}
	};

	/**
	 * dropCell was renamed into Row::knockOutCell(). So, this method is added for back-compatibility .
	 * @method  dropCell
	 * @param  {Number}      cellNum
	 * @return {void}
	 * @deprecated  Use Row::knockOutCell() directly.
	 */
	// this.dropCell = function(cellNum){
	// 	console.log('Table::dropCell() was called. Try to eliminate this call.');
	// 	this.knockOutCell(cellNum);
	// };


	/**
	 * Appends style to a given cell of the row. Alias for Tag::appendStyleToElemAt().
	 * @method appendStyleToCellAt
	 * @param  {Number}       cellNum       index of the target cell
	 * @param  {any}          stl           style to be appended
	 * @return {void}
	 */
	this.appendStyleToCellAt = function (cellNum, stl){
		this.appendStyleToElemAt(cellNum, stl);
	};

	/**
	 * Populates the attributes from a string that is an html repersentation of some row.
	 * It takes a string that is an html representation of a row and update current object
	 * parameters such that it will correspond to the html representation.
	 * In other words, (new Row()).loadFromHtml(htmlString).toHtml() should be similar to htmlString
	 * (eventually up to presence/absence of some parameters and attributes).
	 *
	 * @method loadFromHtml
	 * @param {String} htmlStr
	 * @return {void}
	 * @deprecated in favour of String::createRowFromHtml()
	 */
	this.loadFromHtml = function (htmlStr){
		var parser = new DOMParser(),
			doc = parser.parseFromString('<table>' + htmlStr + '</table>', "text/html"),
			node = doc.getElementsByTagName('tr')[0],
			attrs = node.attributes,
			nodeStyle = node.getAttribute('style'),
			attrObj = {},
			len = attrs.length,
			i, attr;
			//console.log(doc, node);
		for (i = 0; i < len; i++){
			attr = attrs[i];
			if (attr.name !== 'style'){
				attrObj[attr.name] = attr.value;
			}
		}
		this.setStyle(nodeStyle);
		this.setAttr(attrObj);
	};

	/**
	 * If the row corresponds to a framed row (a row for which method
	 * {{#crossLink "Row/onlyTableInside:method"}}onlyTableInside{{/crossLink}} returns true), then
	 * {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} of the cell is returned,
	 * null otherwise.
	 * This is an alias for {{#crossLink "Row/getBogusCellProp:method"}}getBogusCellProp{{/crossLink}}.
	 * @method         phantomCellStyle
	 * @return         {Style|null}
	 */
	this.phantomCellStyles = function(){
		return this.getPhantomCellProp('style');
	};

	/**
	 * If the row corresponds to a framed row (a row for which method
	 * __Row::onlyTableInside()__ returns true), then cell attributes object is returned,
	 * null otherwise. This is an alias for __Row::getBogusCellProp('attr')__.
	 * @method  phantomCellAttr
	 * @return  {Attributes|null}
	 */
	this.phantomCellAttr = function(){
		return this.getPhantomCellProp('attr');
	};

	/**
	 * If the row corresponds to a framed row (a row for which method
	 * {{#crossLink "Row/onlyTableInside:method"}}onlyTableInside{{/crossLink}} returns `true`), then
	 * {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} or
	 * {{#crossLink "Tag/attributes:property"}}attributes{{/crossLink}} is returned,
	 * null otherwise.
	 * @method         getPhantomCellProp
	 * @param          {'style'|'attr'}     prop         name of the property to return)
	 * @return         {Styles|Attributes|Null}
	 */
	this.getPhantomCellProp = function(prop){
		if (this.onlyTableInside()){
			if (prop === 'style'){
				return this.getFirst().getStyles();
			}
			if (prop === 'attr'){
				return this.getFirst().getAttributes();
			}
		}
		return null;
	};

	/**
	 * If the row corresponds to a framed row (a row for which method __Row::onlyTableInside()__
	 * returns true), then requested property name of the table inside the cell inside the row is returned,
	 * null otherwise.
	 * @method  getBogusTableProp
	 * @param  {String}         prop        name of the property to return (intended values: "style" or "attr")
	 * @return {Object|null}
	 */
	this.getBogusTableProp = function(prop){
		// inside the row there is a cell, inside which there is a table
		if (this.onlyTableInside()){
			if (prop === 'style'){
				return this.getFirst().getFirst().getStyles();
			}
			if (prop === 'attr'){
				return this.getFirst().getFirst().getAttributes();
			}
		}
		return null;
	};


	/**
	 * If the row corresponds to a framed row (a row for which method __Row::onlyTableInside()__
	 * returns true), then style of the table inside the cell is returned, null otherwise.
	 * This is an alias for __Row::getBogusTableProp('style')__.
	 * @method  getBogusTableStyle
	 * @return  {Style|null}
	 */
	this.getBogusTableStyle = function(){
		return this.getBogusTableProp('style');
	};

	/**
	 * If the row corresponds to a framed row (a row for which method __Row::onlyTableInside()__
	 * returns true), then attribute of the table inside the cell is returned, null otherwise.
	 * This is an alias for __Row::getBogusTableProp('attr')__.
	 * @method  getBogusTableAttr
	 * @return  {Attributes|null}
	 */
	this.getBogusTableAttr = function(){
		return this.getBogusTableProp('attr');
	};


}
Row.prototype = Object.create(Tag.prototype);