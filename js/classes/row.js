/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global DOMParser, Node, flatten, Attributes, Style, Cell, getProperty, TableRowStyle, Tag, Content */

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
			throw new Error('Only a Cell instance is allowed for insertion!');
		}
		this.insertElemAt(pos, cell);
		return null;
	};

	/**
	 * Appends a cell to the row cells. If one tries to append a non-Cell object, an exception is thrown.
	 * Otherwise, a method appendElem of the parent class is called.
	 * @method appendCell
	 * @param {Object} cell            a cell to be appended.
	 * @return {void}
	 */
	this.appendCell = function(cell){
		// find out with what name the Cell object is registered
		// var cellType = (new Cell()).getType();
		if (!(cell instanceof Cell)){
			throw new Error('The argument is not a Cell instance!');
		}
		this.appendElem(cell);
	};


	/**
	 * Alias for dropElemAt().
	 * @method  dropCellAt
	 * @param  {Number}  pos
	 * @return {void}     [description]
	 */
	this.dropCellAt = function(pos){
		this.dropElemAt(pos);
	}

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
			throw new Error('Cell is not found!');
		}
		return null;
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
	 * @depricated
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
// Row.prototype = new Tag(); wrong way of making inheritance!
Row.prototype = Object.create(Tag.prototype);