/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global DOMParser, Node, flatten, Attributes, Style, Cell, getProperty, TableStyle, TableAttributes, Row, setMinMaxWidth */

/**
* Represents table.
* @module 	attributes
* @class  Table
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
	 * Imposes attributes of the row
	 * @method setAttr
	 * @param {Object} attr
	 * @return {void}
	 */
	this.setAttr = function(attr){
		this.attr = attr;
	};

	/**
	* Attributes of the table.
	* @property {TableAttributes} attr
	* @type {TableAttributes}
	* @default TableAttributes
	*/
	this.attr = new TableAttributes();

	/**
	 * Imposes style of the row
	 * @method setStyle
	 * @param {Object} stl
	 * @return {void}
	 */
	this.setStyle = function(stl){
		this.style = stl;
	};

	/**
	 * Styles of the row
	 * @property {TableStyle} style
	 * @type {TableStyle}
	 * @default TableStyle
	 */
	this.style = new TableStyle();

	/**
	 * Array of rows constituting the table or empty array
	 * @property {Array} rows
	 * @type {Array}
	 * @default []
	 */
	this.rows = [];

	// is it all worth it?!
	this.styleProperty = function (prop) {
		return getProperty(this.style, prop);
	};

	/**
	 * Append a row to the exisiting rows.
	 * @param {Object} row  a row to be appended
	 * @property {Object} appendRow
	 * @return {void}
	 */
	this.appendRow = function(row){
		// find out with what name the Row object is registered
		var rowType = (new Row()).getType();
		if (typeof(row.getType) !== 'function' || row.getType() !== rowType){
			throw new Error('The argument is not of the Row type!');
		}
		this.rows.push(row);
	};

	/**
	 * Retrieves the value of property from the "style"
	 * @method styleProperty
	 * @param  {String} 	prop 	property name which value should be retrieved
	 * @return {String|Number}
	 */
	this.setWidth = function(w){
		setMinMaxWidth(this.style, w);
		this.attr.width = w;
	};

	/**
	 * Gives a two-dimensional array [[w_11, w_12, ..., w_1n], ..., [w_m1, w_m2, ..., w_m3]]
	 * where w_ij is width of the cell located in the row i and column j.
	 * @method  getMatrix
	 * @return {Array}
	 */
	this.getMatrix = function(){
		var output = [],
			rowsNum = this.rows.length, i;
		for (i = 0; i < rowsNum; i++){
			output.push(this.rows[i].getCellWidths());
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
			rowNum = this.rows.length,
			i;

		if (colNum <= 0 || pos < 0 || pos > colNum){
			throw new Error('Wrong index for the cell to insert!');
		}
		if (pos < colNum){
			for (i = 0; i < rowNum; i++){
				this.rows[i].insertCellAt(pos, cell);
			}
		} else {
			for (i = 0; i < rowNum; i++){
				this.rows[i].appendCell(cell);
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
			rowLen = this.rows.length,
			i;
		if (colNumInt === colNum && colNum >= 0 && colNum < colLen) {
			for (i = 0; i < rowLen; i++){
				this.rows[i].appendStyleToCell(colNum, style);
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

/**
 * Returns true, if tableHtml is an html code corresponding to a table each row of which
 * contains just one cell, and this cell in its turn contains only one table.
 * Returns false otherwise.
 * @module  attributes
 * @method  isFramedTable
 * @return  {Boolean} [description]
 */
String.prototype.isFramedTable = function (){
	var tableHtml = this,
		parser = new DOMParser(),
		doc = parser.parseFromString(tableHtml, 'text/html'),
		node = doc.getElementsByTagName('table'),
		isFramed = true,
		tableChildren, tableChildrenLen, currentElem, elemChildren, nestedElem, nestedElemChildren, i;

		// it would be very nice to use this approach, but doc.evaluate always returns "undefined"
		// try{
		// 	var tmp = doc.evaluate('//*', doc, null, XPathResult.ANY_TYPE, tmp);
		// 	console.log('evaluate: ', tmp);
		// } catch (ex){
		// 	console.log("Error! ", ex);
		// }

		if (node.length === 0){
			return false;
		}
		node = node[0];

		// parsing the table structure to decide whether this is a framed table or a regular one.
		tableChildren = node.children[0].children;   // all rows of  the table
		tableChildrenLen = tableChildren.length;
		for (i = 0; i < tableChildrenLen; i++) {
			currentElem = tableChildren[i];          // current row
			elemChildren = currentElem.children;     // all cells inside the row
			if (elemChildren.length !== 1 ){
				isFramed = false;
				break;
			}
			nestedElem = elemChildren[0];     // first cell inside the row
			if (nestedElem.tagName !== 'TD'){
				isFramed = false;
				break;
			}
			nestedElemChildren = nestedElem.children;
			if (nestedElemChildren.length !== 1 || nestedElemChildren[0].tagName !== 'TABLE'){
				isFramed = false;
				break;
			}
		}
		return isFramed;
};

/**
 * Creates an object representation from a string that is an html repersentation of a table.
 * Only one table is supposed to be processed at a time, so the string to be processed is to
 * be of the following form &lt;table ...&gt; ... &lt;/table&gt;. Inside the tag, there should be tags "tr"
 * that will be processed one by one by function String::createRowFromHtml().
 * @module  attributes
 * @method createTableFromHtml
 * @return {Table}
 */
String.prototype.createTableFromHtml = function(){
		var htmlStr = this,
			isFramed = htmlStr.isFramedTable(),
			parser = new DOMParser(),
			doc = parser.parseFromString(htmlStr, 'text/html'),
			node = doc.getElementsByTagName('table'),

			table, attrs, i, nodeStyle, rows, rowsNum, currentRow, row,
			bogusRowAttr, bogusRowStyle, bogusCellAttr, bogusCellStyle, bogusTableAttr, bogusTableStyle;
		if (node.length === 0){
			return null;
		}
		node = node[0];

		// creating table
		table = new Table();

		// imposing table styles
		nodeStyle = node.getAttribute('style');
		table.style = new Style(nodeStyle);
		// imposing table attributes
		attrs = flatten(node.attributes);
		if (attrs.hasOwnProperty('style')){
			delete attrs.style;
		}
		table.attr = new Attributes(attrs);

		// the only child of the table is always tbody
		rows = node.children[0].children;
		rowsNum = rows.length;

		if (isFramed){
			bogusRowStyle = node.querySelector('tr').getAttribute('style');
			bogusCellStyle = node.querySelector('tr td').getAttribute('style');
			bogusTableStyle = node.querySelector('tr td table').getAttribute('style');

			bogusRowAttr = flatten(node.querySelector('tr').attributes);
			if (bogusRowAttr.hasOwnProperty('style')){
				delete bogusRowAttr.style;
			}

			bogusCellAttr = flatten(node.querySelector('tr td').attributes);
			if (bogusCellAttr.hasOwnProperty('style')){
				delete bogusCellAttr.style;
			}

			bogusTableAttr = flatten(node.querySelector('tr td table').attributes);
			if (bogusTableAttr.hasOwnProperty('style')){
				delete bogusTableAttr.style;
			}
			table.bogusRowStyle   = new Style(bogusRowStyle);
			table.bogusRowAttr    = new Attributes(bogusRowAttr);
			table.bogusCellStyle  = new Style(bogusCellStyle);
			table.bogusCellAttr   = new Attributes(bogusCellAttr);
			table.bogusTableStyle = new Style(bogusTableStyle);
			table.bogusTableAttr  = new Attributes(bogusTableAttr);
		}


		// console.log('numero di righe rilevate:', childNum);
		for (i = 0; i < rowsNum; i++){
			if (isFramed){
				currentRow = rows[i].querySelector('td table tr');
			} else {
				currentRow = rows[i];
			}

			if(currentRow.tagName === "TR"){
				// console.log(child);
				row = currentRow.outerHTML.createRowFromHtml();
				table.appendRow(row);
			}
		}
		return table;
};