/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global DOMParser, Node, flatten, Attributes, Style, Cell, getProperty, TableRowStyle, setMinMaxWidth */

/**
 * Represents a table row
 * @module 	attributes
 * @class  Row
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
	* Attributes of the row.
	* @property {Attributes} attr
	* @type {Attributes}
	* @default Attributes
	*/
	this.attr = new Attributes();

	/**
	* Attribute setter.
	* @method setAttr
	* @param {String|Object} attr
	* @return {void}
	*/
	this.setAttr = function(attr){
		this.attr = attr;
	};


	/**
	 * Styles of the row.
	 * @property {TableCellStyle} style
	 * @type {TableCellStyle}
	 * @default TableRowStyle
	 */
	this.style = new TableRowStyle();

	/**
	* Style setter.
	* @method setStyle
	* @param {String|Object} stl
	* @return {void}
	*/
	this.setStyle = function(stl){
		this.style = stl;
	};

	/**
	 * Array of cells belonging to the row.
	 * @property {Array} cells
	 * @type {Array}
	 * @default []
	 */
	this.cells = [];

	/**
	 * Retrieves the value of property from the "style"
	 * @method styleProperty
	 * @param  {String} 	prop 	property name which value should be retrieved
	 * @return {String|Number}
	 */
	this.styleProperty = function (prop) {
		return getProperty(this.style, prop);
	};

	/**
	 * Imposes the value of the width of the "attr" and "style" properties. In the latter, "min-width" and "max-width" are imposed as well.
	 * It is better to use with an integer argument.
	 * @method  setWidth
	 * @param {String|Number} 	w 	value of the width. Supposed to be either a string (i.e. "10px", "14.1em" etc) or a number (i.e. 200, 10).
	 */
	this.setWidth = function(w){
		setMinMaxWidth(this.style, w);
		this.attr.width = w;
	};

	/**
	 * Gets an array of the widths of the cells inside the row.
	 * @method getCellWidths
	 * @return {array}
	 */
	this.getCellWidths = function(){
		var output = [],
			cellNum = this.cells.length,
			i;
		for (i = 0; i < cellNum; i++){
			output.push(this.cells[i].getWidth());
		}
		return output;
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
		if (this.cells.length === len){
			for (i = 0; i < len; i++){
				this.cells[i].setWidth(profile[i]);
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
		var cellNum = this.cellNum();
		if (pos >= 0 && cellNum > 0 && pos <= cellNum){
			var cellType = (new Cell()).getType();
			if (typeof(cell.getType) !== 'function' || cell.getType() !== cellType){
				throw new Error('Trying to insert non-cell object!');
			}
			if (pos === cellNum){
				this.cells.push(cell);
			} else {
				this.cells.splice(pos, 0, cell);
			}
	}
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
		var cellType = (new Cell()).getType();
		if (typeof(cell.getType) !== 'function' || cell.getType() !== cellType){
			throw new Error('The argument is not of the Cell type!');
		}
		this.cells.push(cell);
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
		if (cellNum < this.cells.length){
			if (this.cells[cellNum + 1] !== undefined){
				acceptor = this.cells[cellNum + 1];
			} else {
				if (this.cells[cellNum - 1] !== undefined){
				acceptor = this.cells[cellNum - 1];
				}
			}
			if (acceptor){
				acceptorWidth = acceptor.getWidth();
				currentCell = this.cells[cellNum];
				currentCellWidth = currentCell.getWidth();
				acceptor.setWidth(acceptorWidth + currentCellWidth);
			}
			this.cells.splice(cellNum, 1);
		}

	};

	/**
	 * Gives the number of cells in the row.
	 * @method cellNum
	 * @return {Number}
	 */
	this.cellNum = function(){
		return this.cells.length;
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
			this.cells[cellNum].appendStyle(stl);
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
		cellsNumber = this.cells.length;
		for (i = 0; i < cellsNumber; i++) {
			htmlRow += this.cells[i].toHtml();
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

/**
 * Transforms a row-html string into a Row object. It is supposed that the string to process is of the
 * following form: <tr ... > ... </tr>. Inside the tag, there might be elements "td" that will be
 * processed one by one by function String::createCellFromHtml().
 * @module  attributes
 * @method createRowFromHtml
 * @return {Object} Row
 */
String.prototype.createRowFromHtml = function(){
		var htmlStr = this,
			parser = new DOMParser(),
			fullTable  = '<table><tbody>' + htmlStr + '</tbody></table>',
			doc = parser.parseFromString(fullTable, 'text/html'),
			node = doc.getElementsByTagName('tr'),
			attrs, i, nodeStyle, cellsNum, currentCell, row, cell, cells;
		if (node.length === 0){
			return null;
		}
		// the first table row is to be processed. The remaining ones will be processed at thier turn.
		node = node[0];
		// object to return
		row = new Row();

		// imposing its styles
		nodeStyle = node.getAttribute('style');
		row.style = new Style(nodeStyle);

		// imposing its attributes
		attrs = flatten(node.attributes);
		if (attrs.hasOwnProperty('style')){
			delete attrs.style;
		}
		row.attr = new Attributes(attrs);

		cells = node.children;
		cellsNum = cells.length;
		for (i = 0; i < cellsNum; i++){
			currentCell = cells[i];
			if(currentCell.tagName === "TD"){
				cell = currentCell.outerHTML.createCellFromHtml();
				row.appendCell(cell);
			}
		}
		return row;
};