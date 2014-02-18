/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global DOMParser, Node, flatten, Attributes, Style, Cell, Table, getProperty, TableRowStyle, Tag, Content */

/**
 * Represents a table row
 * @module 	HtmlElements
 * @class   Row
 * @extends Tag
 */
function Row() {
	"use strict";
	if (!(this instanceof Row)) {
		return new Row();
	}
	// inherit tag properties
	Tag.call(this);

	/**
	 * Type of the object. Return "Row" for the objects of this type.
	 * @method {string} getType
	 * @return {string}
	 * @deprecated   in favour of getName()
	 */
	this.getType = function(){
		return "Row";
	};

	/**
	 * Html tag corresponding to Row instances.
	 * @property {String}    name
	 * @type     {String}
	 * @default  td
	 */
	this.name = 'tr';

	/**
	 * Styles of the row.
	 * @property {TableCellStyle} style
	 * @type {TableCellStyle}
	 * @default TableRowStyle
	 */
	this.style = new TableRowStyle();

	/**
	 * Gets an array of the widths of the cells inside the row.
	 * @method getCellWidths
	 * @return {array}
	 */
	this.getCellWidths = function(){
		var output = [],
			cellNum = this.cellNum(),
			i;
		for (i = 0; i < cellNum; i++){
			output.push(this.getElem(i).getWidth());
		}
		return output;
	};

	/**
	 * Alias for length() method of the parent class.
	 * @method  cellNum
	 * @return {Number}
	 */
	this.cellNum = function(){
		return this.length();
	};

	/**
	 * Sets widths of the cells inside the row.
	 * @method setCellWidths
	 * @param {Array} profile          each elements if this array is a width of the corresp. cell in the row.
	 * @return {void}
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
	 * @method insertCellAt
	 * @param  {Cell}   cell        a cell to insert. If not a Cell instance, an error will be thrown.
	 * @param  {Number} pos         position at which the cell is to be inserted.
	 * @return {void}
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
	 * @method  onlyTableInside
	 * @return {Boolean}
	 */
	this.onlyTableInside = function(){
		var cell = this.getFirst();
		if (this.cellNum() !== 1 || cell.length() !== 1){
			console.log('returning FALSE');
			return false;
		}
		return (cell.getFirst() instanceof Table);
	};

	/**
	 * Alias for dropElemAt().
	 * @method  dropCellAt
	 * @param  {Number}     pos     index of the cell to de dropped out.
	 * @return {void}
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
	 * @method knockOutCell
	 * @param  {Number}    cellNum         cell number to delete. Numeration starts with 0.
	 * @return {void}      after
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
			// console.log(doc, node);
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
	 * __Row::onlyTableInside()__ returns true), then style of the cell is returned,
	 * null otherwise. This is an alias for __Row::getBogusCellProp('style')__.
	 * @method  getBogusCellStyle
	 * @return  {Style|null}
	 */
	this.getBogusCellStyle = function(){
		return this.getBogusCellProp('style');
	};

	/**
	 * If the row corresponds to a framed row (a row for which method
	 * __Row::onlyTableInside()__ returns true), then cell attributes object is returned,
	 * null otherwise. This is an alias for __Row::getBogusCellProp('attr')__.
	 * @method  getBogusCellAttr
	 * @return  {Attributes|null}
	 */
	this.getBogusCellAttr = function(){
		return this.getBogusCellProp('attr');
	};

	/**
	 * If the row corresponds to a framed row (a row for which method
	 * __Row::onlyTableInside()__ returns true), then requested property the cell inside the row is returned,
	 * null otherwise.
	 * @method  getBogusCellProp
	 * @param  {String}    prop         name of the property to return (intended values: "style" or "attr")
	 * @return {Object}
	 */
	this.getBogusCellProp = function(prop){
		return this.onlyTableInside() ? this.getFirst()[prop] : null;
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
		return this.onlyTableInside() ? this.getFirst().getFirst()[prop] : null;
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