/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global DOMParser, Node, flatten, Attributes, Style, Cell, Helper, getProperty, TableStyle, TableAttributes, Row, setMinMaxWidth, Tag, Content */

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
	// inherit tag properties
	Tag.call(this);

	/**
	 * Type of the object. Returns "Table" for the objects of this type.
	 * @method  {string} getType
	 * @return  {string}
	 * @deprecated  in favor of getName()
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
	* Attributes of the table. Overrides parent property "attr".
	* @property {TableAttributes} attr
	* @type {TableAttributes}
	* @default TableAttributes
	*/
	this.attr = new TableAttributes();

	/**
	 * Styles of the row. Overrides parent property "style".
	 * @property {TableStyle} style
	 * @type {TableStyle}
	 * @default TableStyle
	 */
	this.style = new TableStyle();

	/**
	 * The number of the rows in the table. Alias of length() of the parent class.
	 * @method  rowNum
	 * @return {Number}
	 */
	this.rowNum = function(){
		return this.length();
	};

	/**
	 * Appends a row to the content property. If the argument is not a Row instance, an error is thrown.
	 * @method   appendRow
	 * @param    {Object} row     a row to append. If not a Row instance, an error is thrown.
	 * @return   {void}
	 */
	this.appendRow = function(row){
		if (!(row instanceof Row)){
			throw new Error('The argument is not a Row instance!');
		}
		this.appendElem(row);
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
	 * have the same cell widths. Otherwise null is returned.
	 * @method  getProfile
	 * @return {Array|Null}
	 */
	this.getProfile = function (){
		return this.isSameWidths() ? this.getMatrix()[0] : null;
	};

	/**
	 * Imposes the widths of all cell in all rows of the table. If the argument is not array, an error is thrown.
	 * If the array length is different from the number of columns, an error is thrown. Otherwise, it is called
	 * method of Row::setCellWidths on each table row.
	 * @method  setProfile
	 * @param   {Array}   profile      an array of cell widths that will be applied to each row.
	 * @return  {void}
	 */
	this.setProfile = function(profile){
		var len = this.rowNum(),
			cols = this.colNum(),
			i;
		if (!Array.isArray(profile)){
			throw new Error('Wrong argument type: array expected.');
		}
		if (profile.length !== cols){
			throw new Error('Wrong input array lenght!');
		}
		for (i = 0; i < len; i++){
			this.getElem(i).setCellWidths(profile);
		}
	};

	/**
	 * Inserts a cell "cell" into a given position "pos" of each row of the table.
	 * If the table has 5 columns, then after insertion it will have 5+1=6 columns.
	 * Position "pos" will correspond to the index of the inserted cell in the row after insertion.
	 * "pos" must be a valid cell number into the table after insertion. So, for the example above,
	 * the valid values for "pos" are 0, 1, 2, 3, 4 and 5.
	 * @method insertColAt
	 * @param  {Cell} 	cell
	 * @param  {Number} pos
	 * @return {void}
	 */
	this.insertColAt = function(pos, cell){
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
	 * Knocks out given column from the table. The operation is delegated to the `Row::knockOutCell()`
	 * @method knockOutCol
	 * @param  {integer} 	colNum        the number of the column to be knocked out. Numeration starts with 0.
	 * @return {void}
	 */
	this.knockOutCol = function(colNum){
		var rowsNum = this.rowNum(),
		i;
		for (i = 0; i < rowsNum; i++){
			this.getElem(i).knockOutCell(colNum);
		}
	};

	/**
	 * Drops specified column from the table. The operation is delegated to the `Row::dropCellAt()`
	 * @method dropColAt
	 * @param  {integer} 	colNum           the number of the column to delete. Numeration starts with 0.
	 * @return {void}
	 */
	this.dropColAt = function(colNum){
		var rowsNum = this.rowNum(),
		i;
		for (i = 0; i < rowsNum; i++){
			this.getElem(i).dropCellAt(colNum);
		}
	};

	/**
	 * Gives the number of columns in the table or null if not all rows have the same number of cells.
	 * The operation is delegated to the `Row::cellNum()`.
	 * @method  colNum
	 * @return {Number|null}
	 */
	this.colNum = function(){
		var rowNum = this.rowNum(),
			firstRowCellNum, i;
		// if table has no rows, return 0 as number of column
		if (rowNum === 0){
			return 0;
		}
		firstRowCellNum = this.getElem(0).cellNum();
		// if the table has a unique row
		if (rowNum === 1){
			return firstRowCellNum;
		}

		for (i = 1; i < rowNum; i++){
			if (this.getElem(i).cellNum() !== firstRowCellNum){
				return null;
			}
		}
		return firstRowCellNum;
	};

	/**
	 * Whether all rows in the table have the same cell widths.
	 * @method isSameWidth
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
	 * @param   {Object}     borderInfo        Object containing 'width', 'color' and 'style' for the border to set.
	 * @default border-width is set to 1, border-color is set to #000000, border-style is set to solid.
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
	 * Returns true if the table is framed, and false otherwise. It takes table rows and call method
	 * `Row::onlyTableInside()` on each of them until first "false" is encountered.
	 * <br />A table is a __framed table__ if all table rows have only one cell and this cell contains
	 * only one element that is a Table instance.
	 * @method     isFragmented
	 * @return     {Boolean}       true if the table is framed, and false otherwise
	 */
	this.isFragmented = function(){
		if (this.rowNum() === 0){
			return false;
		}
		return this.content.elements.every(function(row){
			return row.onlyTableInside();
		});
	};

	/**
	 * Gives true if all table rows have border around (that is, each row is nothing but a table with border)
	 * false otherwise. It at least one of the properties, corresponding to the "bogus" elements is set, then
	 * the table is considered as being framed and hence all its rows will be framed.
	 * @method isFramed
	 * @return {Boolean}     true, if all table rows have border around
	 */
	this.isFramed = function(){
		// if at least one of these properties is set, the table is considered as being framed.
		var propertyList = ['bogusRowStyle', 'bogusRowAttr', 'bogusCellStyle',
							'bogusCellAttr', 'bogusTableStyle', 'bogusTableAttr'],
			that = this;
		return propertyList.some(function(prop){
			return (that[prop] !== undefined) &&  that[prop];
		});
	};

	/**
	 * Resets bogus properties. After resetting those properties, the table becomes a table without frame.
	 * @method resetBogus
	 * @return {void}
	 */
	this.resetBogus = function(){
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
	 * Appends the style to the column. If the column exists, the method call `Row::appendStyleToCell()`
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
				this.getElem(i).appendStyleToCellAt(colNum, style);
			}
		} else {
			throw new Error('The column is not present!');
		}


	};

	/**
	 * Generates table-specific html code with corresponding attributes and styles.
	 * Creation of the row-related html of each row is delegated to `Row::toHtml()`
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
			bogusRowStyle   = Helper.sandwichWith('style="', this.bogusRowStyle.toString(), '"');
			bogusCellAttr   = this.bogusCellAttr   ? this.bogusCellAttr.toString() : '';
			bogusCellStyle  = Helper.sandwichWith('style="', this.bogusCellStyle.toString(), '"');
			bogusTableAttr  = this.bogusTableAttr  ? this.bogusTableAttr.toString() : '';
			bogusTableStyle = Helper.sandwichWith('style="', this.bogusTableStyle.toString(), '"');

			bogusRowHtml = Helper.sandwichWith('<', [rowTag, bogusRowAttr, bogusRowStyle].concatDropSpaces(), '>');
			bogusCellHtml = Helper.sandwichWith('<', [cellTag, bogusCellAttr, bogusCellStyle].concatDropSpaces(), '>');
			bogusTableHtml = Helper.sandwichWith('<', [tableTag, bogusTableAttr, bogusTableStyle].concatDropSpaces(), '>');

			epilogue = bogusRowHtml + bogusCellHtml + bogusTableHtml;
			prologue = Helper.sandwichWith('</', tableTag, '>') + Helper.sandwichWith('</', cellTag, '>') + Helper.sandwichWith('</', rowTag, '>');
		}
		tableAttr  = this.attr  ? this.attr.toString() : '';
		tableStyle = Helper.sandwichWith('style="', this.style.toString(), '"');
		tableHtml  = Helper.sandwichWith('<', [tableTag, tableAttr, tableStyle].concatDropSpaces(), '>');
		rowsNumber = this.rowNum();
		for (i = 0; i < rowsNumber; i++) {
			tableHtml += epilogue;
			tableHtml += this.getElem(i).toHtml();
			tableHtml += prologue;
		}
		tableHtml += Helper.sandwichWith('</', tableTag, '>');
		return tableHtml;
	};

	/**
	 * Style of the row containing a single cell. It is used to created to a table with framed lines.
	 * It is supposed that all properties
	 * bogusRowStyle, bogusRowAttr, bogusCellStyle, bogusCellAttr, bogusTableStyle, bogusTableAttr
	 * are simultaneously null or set.
	 * @property {Style} bogusRowStyle
	 * @default  null
	 */
	this.bogusRowStyle = null; // new TableRowStyle();

	/**
	 * Attributes of the row containing a single cell. It is used to created to a table with framed lines.
	 * It is supposed that all properties
	 * bogusRowStyle, bogusRowAttr, bogusCellStyle, bogusCellAttr, bogusTableStyle, bogusTableAttr
	 * are simultaneously null or set.
	 * @property {Attribute} bogusRowAttr
	 * @default  null
	 */
	this.bogusRowAttr = null; // new Attributes();

	/**
	 * Style of the  the cell which fills the whole row. It is used to created to a table with framed lines.
	 * It is supposed that all properties
	 * bogusRowStyle, bogusRowAttr, bogusCellStyle, bogusCellAttr, bogusTableStyle, bogusTableAttr
	 * are simultaneously null or set.
	 * @property {TableCellStyle} bogusCellStyle
	 * @default  null
	 */
	this.bogusCellStyle = null; // new TableCellStyle();

	/**
	 * Attributes of the  the cell which fills the whole row. It is used to created to a table with framed lines.
	 * It is supposed that all properties
	 * bogusRowStyle, bogusRowAttr, bogusCellStyle, bogusCellAttr, bogusTableStyle, bogusTableAttr
	 * are simultaneously null or set.
	 * @property {Attribute} bogusCellAttr
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
	 * @property {Attribute} bogusTableAttr
	 * @default  null
	 */
	this.bogusTableAttr = null; // new Attributes();

	/**
	 * If the table is fragmented and all rows have the same requested property, then
	 * this property of the first row is returned. In any other case, null is returned.
	 * NB: to compare requested property for all rows, this property must be an object
	 * with boolean-valued method isTheSameAs().
	 * @method   getBogusRowProp
	 * @param    {String}         prop      a name of the property to return. All rows shiuld have this property.
	 * @return   {Object|null}			    the value of the property specified by the argument, if it is the same
	 *                                      for all rows, null otherwise.
	 */
	this.getBogusRowProp = function(prop){
		if (!this.isFragmented()){
			return null;
		}
		var firstRow = this.getFirst(),
			rowNum = this.rowNum(),
			rowProp, i, firstRowProp;
		if (firstRow.hasOwnProperty(prop)){
			firstRowProp = firstRow[prop];
		} else {
			return null;
		}
		if (rowNum === 1){
			return firstRowProp;
		}
		if (typeof firstRowProp.isTheSameAs !== 'function'){
			return null;
		}
		for (i = 1; i < rowNum; i++){
			rowProp = this.getElem(i)[prop];
			if (!firstRowProp.isTheSameAs(rowProp)){
				return null;
			}
		}
		return firstRowProp;

	};


	/**
	 * If the table is fragmented and all the rows have the same styles, then this style is returned.
	 * Otherwise, null is returned. This is an alias for `Table::getBogusRowProp('style')`.
	 * @method   getBogusRowStyle
	 * @return   {Style|null}
	 */
	this.getBogusRowStyle = function(){
		return this.getBogusRowProp('style');
	};

	/**
	 * If the table is fragmented and all the rows have the same styles, then this style is returned.
	 * Otherwise, null is returned. This is an alias for `Table::getBogusRowProp('attr')`.
	 * @method   getBogusRowAttr
	 * @return   {Attributes|null}
	 */
	this.getBogusRowAttr = function(){
		return this.getBogusRowProp('attr');
	};

	/**
	 * If the table is fragmented, gives the requested property of the bogus cell if that property is
	 * the same for all rows. Otherwise, null is returned.
	 * @method  getBogusCellProp
	 * @param  {String}      propName            requested property (supposed to be "style" or "attr")
	 * @return {Object|null}
	 */
	this.getBogusCellProp = function(propName){
		if (!this.isFragmented()){
			return null;
		}
		var rowNum = this.rowNum(),
			firstRow = this.getFirst(),
			firstRowProp, i, currentRowProp;
		firstRowProp = firstRow.getBogusCellProp(propName);
		if (rowNum === 1){
			return firstRowProp;
		}
		for (i = 1; i < rowNum; i++){
			currentRowProp = this.getElem(i).getBogusCellProp(propName);
			if (!firstRowProp.isTheSameAs(currentRowProp)){
				return null;
			}
		}
		return firstRowProp;
	};

	/**
	 * If the table is fragmented, returns the style of the bogus cell if it is the same for all cells.
	 * Otherwise, null is returned. This is an alias for `Table::getBogusCellProp('style')`.
	 * @method   getBogusCellStyle
	 * @return   {Style|null}
	 */
	this.getBogusCellStyle = function(){
		return this.getBogusCellProp('style');
	};

	/**
	 * If the table is fragmented, returns the attributes of the bogus cell if it is the same for all cells.
	 * Otherwise, null is returned. This is an alias for `Table::getBogusCellProp('attr')`.
	 * @method   getBogusCellAttr
	 * @return   {Attributes|null}
	 */
	this.getBogusCellAttr = function(){
		return this.getBogusCellProp('attr');
	};


	/**
	 * If the table is fragmented, gives the requested property of the bogus cell if that property is
	 * the same for all rows. Otherwise, null is returned.
	 * @method  getBogusTableProp
	 * @param   {String}     propName            requested property (supposed to be "style" or "attr")
	 * @return  {Object|null}
	 */
	this.getBogusTableProp = function(propName){
		if (!this.isFragmented()){
			return null;
		}
		var rowNum = this.rowNum(),
			firstRow = this.getFirst(),
			firstRowProp, i, currentRowProp;
		firstRowProp = firstRow.getBogusTableProp(propName);
		if (rowNum === 1){
			return firstRowProp;
		}
		for (i = 1; i < rowNum; i++){
			currentRowProp = this.getElem(i).getBogusTableProp(propName);
			if (!firstRowProp.isTheSameAs(currentRowProp)){
				return null;
			}
		}
		return firstRowProp;

	};

	/**
	 * If the table is fragmented, returns the style of the bogus table if it is the same for all tables.
	 * Otherwise, null is returned. This is an alias for `Table::getBogusTableProp('style')`.
	 * @method   getBogusTableStyle
	 * @return   {Style|null}
	 */
	this.getBogusTableStyle = function(){
		return this.getBogusTableProp('style');
	};

	/**
	 * If the table is fragmented, returns the attributes of the bogus table if it is the same for all tables.
	 * Otherwise, null is returned. This is an alias for `Table::getBogusTableProp('attr')`.
	 * @method   getBogusTableAttr
	 * @return   {Attributes|null}
	 */
	this.getBogusTableAttr = function(){
		return this.getBogusTableProp('attr');
	};


	/**
	 * If the table is fragmented, then sets up the bogus properties and rearrange content property.
	 * If not, the table remains as it is.
	 * @method   desintangle
	 * @return   {void}
	 */
	this.disentangle = function(){
		if (!this.isFragmented()){
			return null;
		}
		var newContent = new Content(),
			rowNum = this.rowNum(),
			i;
		this.bogusRowAttr = this.getBogusRowAttr();
		this.bogusRowStyle = this.getBogusRowStyle();
		this.bogusCellAttr = this.getBogusCellAttr();
		this.bogusCellStyle = this.getBogusCellStyle();
		this.bogusTableAttr = this.getBogusTableAttr();
		this.bogusTableStyle = this.getBogusTableStyle();
		for (i = 0; i < rowNum; i++){
			newContent.appendElem(this.getElem(i).getFirst().getFirst().getFirst());
		}
		this.content = newContent;

	};
}
Table.prototype = Object.create(Tag.prototype);