/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global DOMParser, Node, flatten, Attributes, Style, Cell, getProperty, TableStyle, TableAttributes, Row, setMinMaxWidth, Tag */

/**
* Represents table.
* @module  HtmlElements
* @class   Table
* @extends Tag
*/
function Table() {
	"use strict";
	if (!(this instanceof Table)) {
		return new Table();
	}

	/**
	 * Type of the object. Returns "Table" for the objects of this type.
	 * @method  {string} getType
	 * @return  {string}
	 */
	this.getType = function(){
		return "Table";
	};

	/**
	 * Html tag corresponding to Table instances.
	 * @property {String}    name
	 * @type     {String}
	 * @default  table
	 */
	this.name = 'table';

	/**
	* Attributes of the table.
	* @property {TableAttributes} attr
	* @type {TableAttributes}
	* @default TableAttributes
	*/
	this.attr = new TableAttributes();

	/**
	 * Styles of the row
	 * @property {TableStyle} style
	 * @type {TableStyle}
	 * @default TableStyle
	 */
	this.style = new TableStyle();

	/**
	 * The number of the rows in the table. Delegates its functionality to Content::length.
	 * @method  rowNum
	 * @return {Number}
	 */
	this.rowNum = function(){
		return this.content.length();
	};

	/**
	 * Append a row to the content property. If object to insert is not a Row instance, error is thrown.
	 * @method appendRow
	 * @param {Object} row  a row to be appended
	 * @return {void}
	 */
	this.appendRow = function(row){
		// find out with what name the Row object is registered
		// var rowType = (new Row()).getType();
		// if (typeof(row.getType) !== 'function' || row.getType() !== rowType){
		if (!(row instanceof Row)){
			throw new Error('The argument is not of the Row type!');
		}
		this.content.appendElem(row);
	};

	/**
	 * Gives a two-dimensional array [[w_11, w_12, ..., w_1n], ..., [w_m1, w_m2, ..., w_m3]]
	 * where w_ij is width of the cell located in the row i and column j.
	 * @method  getMatrix
	 * @return {Array}
	 */
	this.getMatrix = function(){
		var output = [],
			rowsNum = this.rowNum(), i;
		for (i = 0; i < rowsNum; i++){
			output.push(this.getElem(i).getCellWidths());
		}
		return output;
	};

	/**
	 * Returns array of widths of the cells in the table rows if all rows
	 * have the same cell widths. Otherwise Null is returned.
	 * @method  getProfile
	 * @return {Array|Null}
	 */
	this.getProfile = function (){
		return this.isSameWidths() ? this.getMatrix()[0] : null;
	};

	/**
	 * Imposes the widths of all cell in all rows of the table. The operation is delegated to a row methods.
	 * @method  setProfile
	 * @param   {Array}   profile      an array of cell widths that will be applied to each row.
	 */
	this.setProfile = function(profile){
		var len = this.rows.length,
			i;
		for (i = 0; i < len; i++){
			this.rows[i].setCellWidths(profile);
		}
	};

	/**
	 * Inserts a cell "cell" into a given position "pos" of each row of the table.
	 * If the table has 5 columns, then after insertion it will have 5+1=6 columns.
	 * Position "pos" will correspond to the index of the inserted cell in the row after insertion.
	 * "pos" must be a valid cell number into the table after insertion. So, for the example above,
	 * the valid values for "pos" are 0, 1, 2, 3, 4 and 5.
	 * @method insertColumnAt
	 * @param  {Cell} 	cell
	 * @param  {Number} pos
	 * @return {void}
	 */
	this.insertColumnAt = function(pos, cell){
		cell = cell || (new Cell());
		var colNum = this.colNum(),
			rowNum = this.rowNum(),
			i;

		if (colNum <= 0 || pos < 0 || pos > colNum){
			throw new Error('Wrong index for the cell to insert!');
		}
		if (pos < colNum){
			for (i = 0; i < rowNum; i++){
				this.getElem(i).insertCellAt(pos, cell);
			}
		} else {
			for (i = 0; i < rowNum; i++){
				this.getElem(i).appendCell(cell);
			}
		}
		return null;
	};

	/**
	 * Drops specified column from the table. The operation is delegated to the Row::dropCell()
	 * @method dropColumn
	 * @param  {integer} 	colNum  the number of the column to delete. Numeration starts with 0.
	 * @return {void}
	 */
	this.dropColumn = function(colNum){
		var rowsNum = this.rows.length,
		i;
		for (i = 0; i < rowsNum; i++){
			this.rows[i].dropCell(colNum);
		}
	};

	/**
	 * Gives the number of columns in the table or null if not all rows have the same number of cells.
	 * The operation is delegated to the Row::cellNum().
	 * @method  colNum
	 * @return {Number|null}
	 */
	this.colNum = function(){
		var rowNum = this.rows.length,
			firstRowCellNum, i;
		// if table has no rows, return 0 as number of column
		if (rowNum === 0){
			return 0;
		}
		firstRowCellNum = this.rows[0].cellNum();
		// if the table has a unique row
		if (rowNum === 1){
			return firstRowCellNum;
		}

		for (i = 1; i < rowNum; i++){
			if (this.rows[i].cellNum() !== firstRowCellNum){
				return null;
			}
		}
		return firstRowCellNum;
	};

	/**
	 * Whether all rows in the table have the same cell widths.
	 * @method sameWidth
	 * @return {Boolean} true, if all rows have the same cells' widths, false otherwise.
	 */
	this.isSameWidths = function(){
		var matrix = this.getMatrix(),
			rowsNum = matrix.length,
			output = true,
			firstRow, firstRowLen, i, j;
		// only if the number of rows is bigger than 1
		if (rowsNum > 1){
			// compare the first row with the rest
			firstRow = matrix[0];
			firstRowLen = firstRow.length;
			for (i = 1; i < rowsNum; i++){
				if (matrix[i].length !== firstRowLen){
					output = false;
					break;
				}
				// compare element by element
				for (j = 0; j < firstRowLen; j++){
					if(matrix[i][j] !== firstRow[j]){
						output = false;
						break;
					}
				}
				// exit as well from outer loop if necessary
				if (!output){
					break;
				}
			}
		}
		return output;
	};

	/**
	 * Set the border of the table. It updates the properties 'attr' and 'style' of the instance:
	 * 1. in 'style' property, sets up the following properties: 'border-width', 'border-color' and 'border-style'
	 * 2. in 'attr' property, sets up 'border' property.
	 * Note that if after setting the border there is an assigment of 'style' or 'attr' property, then some info about the border might be overwritten.
	 * @method  setBorder
	 * @param {Object} borderInfo  Object containing 'width', 'color' and 'style' fo the border to set.
	 * @default  border-width is set to 1, border-color is set to #000000, border-style is set to solid.
	 * @return {void}
	 */
	this.setBorder = function(borderInfo){
		var bw, bc, bs;
		if (borderInfo === undefined){
			borderInfo = {'width': 1, 'color': '#000000', 'style': 'solid'};
		}
		bw = borderInfo.width || 1;
		bc = borderInfo.color || '#000000';
		bs = borderInfo.style || 'solid';

		this.style['border-width'] = bw;
		this.style['border-color'] = bc;
		this.style['border-style'] = bs;
		this.attr.border = bw;
	};

	/**
	 * Removes the border of the table. It updates the properties 'attr' and 'style' of the instance:
	 * 1. in 'style' property, deletes the properties: 'border-width', 'border-color' and sets up 'border-style' to 'none'
	 * 2. in 'attr' property, deletes 'border' property.
	 * @method  removeBorder
	 * @return {void}
	 */
	this.removeBorder = function(){
		if (this.style.hasOwnProperty('border-width')) {
			delete this.style['border-width'];
		}
		if (this.style.hasOwnProperty('border-color')) {
			delete this.style['border-color'];
		}
		this.style['border-style'] = 'none';

		if (this.attr.hasOwnProperty('border')) {
			delete this.attr.border;
		}
	};

	/**
	 * Gives true if all table rows have border around (that is, each row is nothing but a table with border)
	 * false otherwise. It at least one of the properties, corresponding to the "bogus" elements is set, then
	 * the table is considered as being framed and hence all its rows will be framed.
	 * @method isFramed
	 * @return {Boolean}     true if all table rows have border around
	 */
	this.isFramed = function(){
		// if at least one of these properties is set, the table is considered as being framed.
		var propertyList = ['bogusRowStyle', 'bogusRowAttr', 'bogusCellStyle',
							'bogusCellAttr', 'bogusTableStyle', 'bogusTableAttr'],
			that = this;
		return propertyList.some(function(prop){
			return that.hasOwnProperty(prop) && that[prop];
		});
	};

	/**
	 * Deletes properties that are responsable for the frames around the table rows.
	 * @return {void}
	 */
	this.removeFrame = function(){
		var propertyList = ['bogusRowStyle', 'bogusRowAttr', 'bogusCellStyle',
							'bogusCellAttr', 'bogusTableStyle', 'bogusTableAttr'],
			propertyListLen = propertyList.length,
			i;
		for (i = 0; i < propertyListLen; i++){
			if(this.hasOwnProperty(propertyList[i])){
				delete this[propertyList[i]];
			}
		}
	};

	/**
	 * Appends the style to the column. If the column exists, the method call Row::appendStyleToCell()
	 * on each of the table rows.
	 * @method appendStyleToCol
	 * @param  {Number}        colNum    column number to which the style is to be appended.
	 * @param  {Style|Object}  style     Style or Object to be appended
	 * @return {void}
	 */
	this.appendStyleToCol = function(colNum, style){
		var colNumInt = parseInt(colNum, 10),
			colLen = this.colNum(),
			rowLen = this.rowNum(),
			i;
		if (colNumInt === colNum && colNum >= 0 && colNum < colLen) {
			for (i = 0; i < rowLen; i++){
				this.getElem(i).appendStyleToCell(colNum, style);
			}
		} else {
			throw new Error('The column is not present!');
		}


	};

	/**
	 * Generates table-specific html code with corresponding attributes and styles.
	 * Creation of the row-related html of each row is delegated to Row::toHtml()
	 * @method toHtml
	 * @return {String}
	 */
	this.toHtml = function () {
		var prologue = '', epilogue = '', tableTag = 'table', rowTag = 'tr', cellTag = 'td',
			bogusRowAttr, bogusRowStyle, bogusCellAttr, bogusCellStyle, bogusTableAttr, bogusTableStyle,
			bogusRowHtml, bogusCellHtml, bogusTableHtml, tableAttr, tableStyle, tableHtml, i, rowsNumber;

		if (this.isFramed()){
			// some preliminaries for the framed tables
			bogusRowAttr    = this.bogusRowAttr    ? this.bogusRowAttr.toString() : '';
			bogusRowStyle   = this.bogusRowStyle   ? this.bogusRowStyle.toString().sandwichWith('style="', '"') : '';
			bogusCellAttr   = this.bogusCellAttr   ? this.bogusCellAttr.toString() : '';
			bogusCellStyle  = this.bogusCellStyle  ? this.bogusCellStyle.toString().sandwichWith('style="', '"') : '';
			bogusTableAttr  = this.bogusTableAttr  ? this.bogusTableAttr.toString() : '';
			bogusTableStyle = this.bogusTableStyle ? this.bogusTableStyle.toString().sandwichWith('style="', '"') : '';

			bogusRowHtml = [rowTag, bogusRowAttr, bogusRowStyle].concatDropSpaces().sandwichWith('<', '>');
			bogusCellHtml = [cellTag, bogusCellAttr, bogusCellStyle].concatDropSpaces().sandwichWith('<', '>');
			bogusTableHtml = [tableTag, bogusTableAttr, bogusTableStyle].concatDropSpaces().sandwichWith('<', '>');

			epilogue = bogusRowHtml + bogusCellHtml + bogusTableHtml;
			prologue = tableTag.sandwichWith('</', '>') + cellTag.sandwichWith('</', '>') + rowTag.sandwichWith('</', '>');
		}
		tableAttr  = this.attr  ? this.attr.toString() : '';
		tableStyle = this.style ? this.style.toString().sandwichWith('style="', '"') : '';
		tableHtml  = [tableTag, tableAttr, tableStyle].concatDropSpaces().sandwichWith('<', '>');
		rowsNumber = this.rows.length;
		for (i = 0; i < rowsNumber; i++) {
			tableHtml += epilogue;
			tableHtml += this.rows[i].toHtml();
			tableHtml += prologue;
		}
		tableHtml += tableTag.sandwichWith('</', '>');
		return tableHtml;
	};

	/**
	 * Style of the row containing a single cell. It is used to created to a table with framed lines.
	 * It is supposed that all properties
	 * bogusRowStyle, bogusRowAttr, bogusCellStyle, bogusCellAttr, bogusTableStyle, bogusTableAttr
	 * are simultaneously null or set.
	 * @property {Style} bogusTableStyle
	 * @default  null
	 */
	this.bogusRowStyle = null; // new TableRowStyle();

	/**
	 * Attributes of the row containing a single cell. It is used to created to a table with framed lines.
	 * It is supposed that all properties
	 * bogusRowStyle, bogusRowAttr, bogusCellStyle, bogusCellAttr, bogusTableStyle, bogusTableAttr
	 * are simultaneously null or set.
	 * @property {Attribute} bogusTableStyle
	 * @default  null
	 */
	this.bogusRowAttr = null; // new Attributes();

	/**
	 * Style of the  the cell which fills the whole row. It is used to created to a table with framed lines.
	 * It is supposed that all properties
	 * bogusRowStyle, bogusRowAttr, bogusCellStyle, bogusCellAttr, bogusTableStyle, bogusTableAttr
	 * are simultaneously null or set.
	 * @property {TableCellStyle} bogusTableStyle
	 * @default  null
	 */
	this.bogusCellStyle = null; // new TableCellStyle();

	/**
	 * Attributes of the  the cell which fills the whole row. It is used to created to a table with framed lines.
	 * It is supposed that all properties
	 * bogusRowStyle, bogusRowAttr, bogusCellStyle, bogusCellAttr, bogusTableStyle, bogusTableAttr
	 * are simultaneously null or set.
	 * @property {Attribute} bogusTableStyle
	 * @default  null
	 */
	this.bogusCellAttr = null; // new Attributes();

	/**
	 * Style of the  the table that will be inserted into the single cell to create a table with framed lines.
	 * It is supposed that all properties
	 * bogusRowStyle, bogusRowAttr, bogusCellStyle, bogusCellAttr, bogusTableStyle, bogusTableAttr
	 * are simultaneously null or set.
	 * @property {TableStyle} bogusTableStyle
	 * @default  null
	 */
	this.bogusTableStyle = null; // new TableStyle();

	/**
	 * Attributes of the  the table that will be inserted into the single cell to create a table with framed lines.
 	 * It is supposed that all properties
 	 * bogusRowStyle, bogusRowAttr, bogusCellStyle, bogusCellAttr, bogusTableStyle, bogusTableAttr
	 * are simultaneously null or set.
	 * @property {Attribute} bogusTableStyle
	 * @default  null
	 */
	this.bogusTableAttr = null; // new Attributes();
}

Table.prototype = new Tag();