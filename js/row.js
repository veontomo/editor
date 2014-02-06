/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global DOMParser, Node, flatten, Attributes, Style, Cell, getProperty, TableRowStyle, Tag */

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
	/**
	 * Type of the object. Return "Row" for the objects of this type.
	 * @method {string} getType
	 * @return {string}
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
	 * Returns the number of cells in the row. Delegates to the length() method of the "content" property.
	 * @method  cellNum
	 * @return {Number}
	 */
	this.cellNum = function(){
		return this.content.length();
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
		if (this.cellNum() === len){
			for (i = 0; i < len; i++){
				this.getElem(i).setWidth(profile[i]);
			}
		}
	};

	/**
	 * Inserts a cell "cell" into position "pos" of the row.
	 * After insertion, the row length increases by 1. Therefore, "pos"
	 * is the index with which the cell is referenced in the row after insertion.
	 * @method insertCellAt
	 * @param  {Cell}   cell
	 * @param  {Number} pos
	 * @return {void}
	 */
	this.insertCellAt = function(pos, cell){
		// var cellType = (new Cell()).getType();
		// if (typeof(cell.getType) !== 'function' || cell.getType() !== cellType){
		// 	throw new Error('Trying to insert non-cell object!');
		// }
		if (!(cell instanceof Cell)){
			throw new Error('Trying to insert non-cell object!');
		}
		this.content.insertElemAt(pos, cell);
		return null;
	};

	/**
	 * Append a cell to the row cells. If one tries to append a non-Cell object, an exception is thrown.
	 * @method appendCell
	 * @param {Object} cell            a cell to be appended.
	 * @return {void}
	 */
	this.appendCell = function(cell){
		// find out with what name the Cell object is registered
		// var cellType = (new Cell()).getType();
		if (!(cell instanceof Cell)){
			throw new Error('The argument is not of the Cell type!');
		}
		this.content.appendElem(cell);
	};


	/**
	 * Drops the cell in the row. If the cell is utmost left, the freed space is then
	 * assigned to its right neighbour:
     * |xxx| a | b   | c | -> |     a | b   | c |
     * | a |xxx| b   | c | -> | a |     b   | c |
	 * If there is no right neighbour, then it is assigned to the left one:
	 * | a | b | c | xxx | -> | a | b | c       |
	 * If a cell to delete does not exist, nothing is performed.
	 * @method dropCell
	 * @param  {Number}    cellNum   cell number to delete. Numeration starts with 0.
	 * @return {void}
	 */
	this.dropCell = function(cellNum){
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
			this.content.dropElemAt(cellNum);
		}

	};

	/**
	 * Appends style to the cell of the row.
	 * @param  {Number}       cellNum       cell number to which the style is to be appended.
	 * @param  {Style|Object} stl           style or object to be appended
	 * @return {void}
	 */
	this.appendStyleToCell = function (cellNum, stl){
		var cellNumInt = parseInt(cellNum, 10),
			rowLen = this.cellNum();
		if (cellNum === cellNumInt && cellNum >= 0 && cellNum < rowLen) {
			this.getElem(cellNum).appendStyle(stl);
		} else {
			throw new Error('The cell is not found!');
		}
		return null;
	};

	/**
	 * Generates row-specific html code with corresponding attributes and styles. Creation of the cell-related html of each cell is delegated to Cell::toHtml()
	 * @method toHtml
	 * @return {String} html representation of the row
	 */
	this.toHtml = function () {
		var i, rowAttr, rowStyle, htmlRow, cellsNumber,
			tag = 'tr';
		rowAttr = this.attr.toString();
		rowStyle = this.style.toString();
		if (rowStyle){
			rowStyle = 'style="' + rowStyle.trim() + '"';
		}
		htmlRow = '<' + [tag, rowAttr, rowStyle].join(' ').replace(/\s+/g, ' ').trim() + '>';
		cellsNumber = this.cellNum();
		for (i = 0; i < cellsNumber; i++) {
			htmlRow += this.getElem(i).toHtml();
		}
		htmlRow += '</' + tag + '>';
		return htmlRow;
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
}
Row.prototype = new Tag();