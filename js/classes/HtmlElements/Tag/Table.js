/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global Attributes, Cell, Helper, TableStyles, Styles, TableAttributes, Row, Tag, Content */

/**
* Represents table.
*
* Table might be a plain one or a framed one. Table is called framed if each of its rows contains only one cell,
* and each of these cells contains another table. These three elements - row, cell and table - are called phantom ones.
* Only {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} and
* {{#crossLink "Tag/attributes:property"}}attributes{{/crossLink}} of the phantom elements are of interest
*
*
* Below it is depicted a framed table. Dotted lines correspond to the phantom elements, solid - to "normal" ones.
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
* @module        HtmlElements
* @class         Table
* @constructor
* @extends       Tag
*/
function Table() {
	"use strict";
	if (!(this instanceof Table)) {
		return new Table();
	}
	// inherit tag properties
	Tag.call(this);


	/**
	 * Re-set private properties defined in parent class {{#crossLink "Tag"}}Tag{{/crossLink}}:
	 * <ol><li>
	 * {{#crossLink "Tag/tag:property"}}tag{{/crossLink}} to be "table"
	 * </li><li>
	 * {{#crossLink "Tag/className:property"}}className{{/crossLink}} to be "Table"
	 * </li><li>
	 * {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} to be
	 * {{#crossLink "TableStyles"}}TableStyles{{/crossLink}}
	 * </li><li>
	 * {{#crossLink "Tag/attributes:property"}}styles{{/crossLink}} to be
	 * {{#crossLink "TableAttributes"}}TableAttributes{{/crossLink}}
	 * </li></ol>
	 * @method         constructor
	 */
	this.setTag('table');
	this.setName('Table');
	this.setStyles(new TableStyles());
	this.setAttributes(new TableAttributes());

	/**
	 * Phantom cell.
	 * @property       {Cell}    phantomCell
	 * @type           {Cell}
	 * @private
	 * @default        undefined
	 */
	var phantomCell;

	/**
	 * Phantom row.
	 * @property       {Row}    phantomRow
	 * @type           {Row}
	 * @private
	 * @default        undefined
	 */
	var phantomRow;


	/**
	 * Phantom table {{#crossLink "Styles"}}styles{{/crossLink}}.
	 * @property       {Table}    phantomTable
	 * @type           {Table}
	 * @private
	 * @default        undefined
	 */
	var phantomTable;

	/**
	 * {{#crossLink "Table/phantomCellStyles:property"}}phantomCellStyles{{/crossLink}} getter.
	 * @method         getPhantomCellStyles
	 * @return         {Styles}
	 */
	this.getPhantomCellStyles = function(){
		if (phantomCell instanceof Cell){
			return phantomCell.getStyles();
		}

	};

	/**
	 * {{#crossLink "Table/phantomCellStyles:property"}}phantomCellStyles{{/crossLink}} setter.
	 * @method         setPhantomCellStyles
	 * @param          {Any}             stl
	 * @return         {void}
	 */
	this.setPhantomCellStyles = function(stl){
		if (stl !== undefined){
			if (!(phantomCell instanceof Cell)){
				phantomCell  = new Cell();
			}
			if (stl instanceof Styles){
				phantomCell.setStyles(stl);
			} else {
				phantomCell.setStyles(new Styles(stl));
			}
		}
	};


	/**
	 * {{#crossLink "Table/phantomCellStyles:property"}}phantomRowStyles{{/crossLink}} getter.
	 * @method         getPhantomRowStyles
	 * @return         {Styles}
	 */
	this.getPhantomRowStyles = function(){
		if (phantomRow instanceof Row){
			return phantomRow.getStyles();
		}
	};

	/**
	 * {{#crossLink "Table/phantomRowStyles:property"}}setPhantomRowStyles{{/crossLink}} setter.
	 * @method         setPhantomRowStyles
	 * @param          {Any}             stl
	 * @return         {void}
	 */
	this.setPhantomRowStyles = function(stl){
		if (stl !== undefined){
			if (!(phantomRow instanceof Row)){
				phantomRow  = new Row();
			}
			if (stl instanceof Styles){
				phantomRow.setStyles(stl);
			} else {
				phantomRow.setStyles(new Styles(stl));
			}
		}
	};


	/**
	 * {{#crossLink "Table/phantomTableStyles:property"}}phantomTableStyles{{/crossLink}} getter.
	 * @method         getPhantomTableStyles
	 * @return         {Styles}
	 */
	this.getPhantomTableStyles = function(){
		if (phantomTable instanceof Table){
			return phantomTable.getStyles();
		}
	};

	/**
	 * {{#crossLink "Table/phantomTableStyles:property"}}phantomTableStyles{{/crossLink}} setter.
	 * @method         setPhantomTableStyles
	 * @param          {Any}             stl
	 * @return         {void}
	 */
	this.setPhantomTableStyles = function(stl){
		if (stl !== undefined){
			if (!(phantomTable instanceof Table)){
				phantomTable = new Table();
			}
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
		if (phantomCell instanceof Cell){
			return phantomCell.getAttributes();
		}

	};

	/**
	 * {{#crossLink "FramedTable/phantomCellAttributes:property"}}phantomCellAttributes{{/crossLink}} setter.
	 * @method         setPhantomCellAttributes
	 * @param          {Properties}             attr
	 * @return         {void}
	 */
	this.setPhantomCellAttributes = function(attr){
		if (attr !== undefined){
			if (!(phantomCell instanceof Cell)){
				phantomCell  = new Cell();
			}
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
		if (phantomRow instanceof Row){
			return phantomRow.getAttributes();
		}

	};

	/**
	 * {{#crossLink "FramedTable/phantomRowAttributes:property"}}phantomRowAttributes{{/crossLink}} setter.
	 * @method         setPhantomRowAttributes
	 * @param          {Properties}         attr
	 * @return         {void}
	 */
	this.setPhantomRowAttributes = function(attr){
		if (attr !== undefined){
			if (!(phantomRow instanceof Row)){
				phantomRow  = new Row();
			}
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
		if (phantomTable instanceof Table){
			return phantomTable.getAttributes();
		}

	};

	/**
	 * {{#crossLink "FramedTable/phantomTableAttributes:property"}}phantomTableAttributes{{/crossLink}} setter.
	 * @method         setPhantomTableAttributes
	 * @param          {Properties}         attr
	 * @return         {void}
	 */
	this.setPhantomTableAttributes = function(attr){
		if (attr !== undefined){
			if (!(phantomTable instanceof Table)){
				phantomTable  = new Table();
			}
			if (attr instanceof Attributes){
				phantomTable.setAttributes(attr);
			} else {
				phantomTable.setAttributes(new Attributes(attr));
			}
		}
	};





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
		//console.log('Table::getMatrix() returning ', output);
		return output;
	};

	/**
	 * Returns array of widths of the cells in the table rows if all rows
	 * have the same cell widths. Otherwise null is returned.
	 * @method  getProfile
	 * @return {Array|Null}
	 */
	this.getProfile = function (){
		var output = this.isSameWidths() ? this.getMatrix()[0] : null;
		//console.log('Table::getProfile() returning ', output);
		return output;
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
	 * insertColumnAt was renamed into Table::insertColAt(). So, this method is added for back-compatibility .
	 * @method        insertColumnAt
	 * @param         {pos}      pos
	 * @param         {cell}     cell
	 * @return        {void}
	 * @deprecated    Use Table::insertColAt() directly.
	 */
	this.insertColumnAt = function(pos, cell){
		console.log('Table::insertColumnAt() was called. Try to eliminate this call.');
		this.insertColAt(pos, cell);
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
	 * dropColumn was renamed into Table::knockOutCol(). So, this method is added for back-compatibility .
	 * @method  dropColumn
	 * @param  {pos}      pos
	 * @param  {cell}     cell
	 * @return {void}
	 * @deprecated  Use Table::knockOutCol() directly.
	 */
	this.dropColumn = function(pos, cell){
		console.log('Table::dropColumn() was called. Try to eliminate this call by using Table::knockOutCol() directly.');
		this.knockOutCol(pos, cell);
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
			//console.log('table::isSameWidth: matrix=', matrix);
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

		this.setStyleProperty('border-width', bw);
		this.setStyleProperty('border-color', bc);
		this.setStyleProperty('border-style', bs);
		this.setAttrProperty('border', bw);
	};

	/**
	 * Removes the border of the table. It updates the properties 'attr' and 'style' of the instance:
	 * 1. in 'style' property, deletes the properties: 'border-width', 'border-color' and sets up 'border-style' to 'none'
	 * 2. in 'attr' property, deletes 'border' property.
	 * @method  removeBorder
	 * @return {void}
	 */
	this.removeBorder = function(){
		if (this.getStyles().hasProperty('border-width')) {
			this.getStyles().dropProperty('border-width');
		}
		if (this.getStyles().hasProperty('border-color')) {
			this.getStyles().dropProperty('border-color');
		}
		this.setStyleProperty('border-style', 'none');

		if (this.getAttributes().hasProperty('border')) {
			this.getAttributes().dropsProperty('border');
		}
	};

	/**
	 * Returns true if the table is fragmented, and false otherwise. It takes table rows and call method
	 * `Row::onlyTableInside()` on each of them until first "false" is encountered.
	 * <br />A table is a __framed table__ if all table rows have only one cell and this cell contains
	 * only one element that is a Table instance.
	 * @method         isFragmented
	 * @return         {Boolean}            true if the table is framed, and false otherwise
	 */
	this.isFragmented = function(){
		if (this.rowNum() === 0){
			return false;
		}
		return this.getElements().every(function(row){
			return row.onlyTableInside();
		});
	};

	/**
	 * Gives true if all table rows have border around (that is, each row is nothing but a table with border)
	 * false otherwise. If at least one of the properties, corresponding to the "phantom" elements is set, then
	 * the table is considered as being framed and hence all its rows will be framed.
	 * @method isFramed
	 * @return {Boolean}     true, if all table rows have border around
	 */
	this.isFramed = function(){
		// if at least one of these properties is set, the table is considered as being framed.
		var propertyList = ['phantomRowStyles', 'phantomRowAttributes', 'phantomCellStyles',
							'phantomCellAttributes', 'phantomTableStyles', 'phantomTableAttributes'],
			that = this;
		return propertyList.some(function(prop){
			return (that[prop] !== undefined) &&  that[prop];
		});
	};

	/**
	 * Resets phantom properties. After resetting those properties, the table becomes a table without frame.
	 * @method resetPhantom
	 * @return {void}
	 */
	this.resetPhantom = function(){
		var propertyList = ['phantomRowStyles', 'phantomRowAttributes', 'phantomCellStyles',
							'phantomCellAttributes', 'phantomTableStyles', 'phantomTableAttributes'],
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
		var phantomTableTag = (new Table()).getTag(),
 			phantomRowTag = (new Row()).getTag(),
			phantomCellTag =  (new Cell()).getTag(),
			prologue, epilogue,

			phantomRowHtml, phantomCellHtml, phantomTableHtml,
			tableHtml, i, rowsNumber;


		if (phantomCell !== undefined || phantomRow !== undefined || phantomTable !== undefined){
			phantomRowHtml = phantomRow ? phantomRow.openingTag() : (new Row()).openingTag();
			phantomCellHtml = phantomCell ? phantomCell.openingTag() : (new Cell()).openingTag();
			phantomTableHtml = phantomTable ? phantomTable.openingTag() : (new Table()).openingTag();
			epilogue = phantomRowHtml + phantomCellHtml + phantomTableHtml;
			prologue = '</' + phantomTableTag + '></' + phantomCellTag + '></' +  phantomRowTag + '>';
		} else {
			epilogue = '';
			prologue = '';
		}

		// tableAttributes = this.getAttributes().toString();
		// tableStyles = this.getStyles().toString();
		tableHtml  = this.openingTag();
		rowsNumber = this.rowNum();
		for (i = 0; i < rowsNumber; i++) {
			tableHtml += epilogue;
			tableHtml += this.getElem(i).toHtml();
			tableHtml += prologue;
		}
		tableHtml += this.closingTag();
		return tableHtml;
	};



	/**
	 * If the table is fragmented and all rows have the same requested property, then
	 * this property of the first row is returned. In any other case, null is returned.
	 * NB: to compare requested property for all rows, this property must be an object
	 * with boolean-valued method isTheSameAs().
	 * @method   getPhantomRowProp
	 * @param    {String}         prop      a tag of the property to return. All rows should have this property.
	 * @return   {Object|null}			    the value of the property specified by the argument, if it is the same
	 *                                      for all rows, null otherwise.
	 */
	this.getPhantomRowProp = function(prop){
		if (!this.isFragmented()){
			return null;
		}
		var firstRow = this.getFirst(),
			rowNum = this.rowNum(),
			rowProp, i, firstRowProp;
		switch (prop){
			case 'attr':
				firstRowProp = firstRow.getAttributes();
				break;
			case 'style':
				firstRowProp = firstRow.getStyles();
				break;
			default:
				return null;
		}
		if (rowNum === 1){
			return firstRowProp;
		}
		if (typeof firstRowProp.isTheSameAs !== 'function'){
			return null;
		}
		for (i = 1; i < rowNum; i++){
			rowProp = (prop === 'style') ? (this.getElem(i).getStyles()) : (prop === 'attr' ? this.getElem(i).getAttributes() : null) ;
			if (!firstRowProp.isTheSameAs(rowProp)){
				return null;
			}
		}
		return firstRowProp;

	};


	/**
	 * If the table is fragmented, gives the requested property of the phantom cell if that property is
	 * the same for all rows. Otherwise, null is returned.
	 * @method        getPhantomCellProp
	 * @param         {String}              propName            requested property (supposed to be "style" or "attr")
	 * @return        {Object|null}
	 */
	this.getPhantomCellProp = function(propName){
		if (!this.isFragmented()){
			return null;
		}
		var rowNum = this.rowNum(),
			firstRow = this.getFirst(),
			firstRowProp, i, currentRowProp;
		firstRowProp = firstRow.getPhantomCellProp(propName);
		console.log('Table::getPhantomCellProp : firstRowProp(', propName, ') = ', firstRowProp);
		if (rowNum === 1){
			return firstRowProp;
		}
		for (i = 1; i < rowNum; i++){
			currentRowProp = this.getElem(i).getPhantomCellProp(propName);
			if (!firstRowProp.isTheSameAs(currentRowProp)){
				return null;
			}
		}
		return firstRowProp;
	};

	/**
	 * If the table is fragmented, gives the requested property of the phantom cell if that property is
	 * the same for all rows. Otherwise, null is returned.
	 * @method  getPhantomTableProp
	 * @param   {String}     propName            requested property (supposed to be "style" or "attr")
	 * @return  {Object|null}
	 */
	this.getPhantomTableProp = function(propName){
		if (!this.isFragmented()){
			return null;
		}
		var rowNum = this.rowNum(),
			firstRow = this.getFirst(),
			firstRowProp, i, currentRowProp;
		firstRowProp = firstRow.getPhantomTableProp(propName);
		if (rowNum === 1){
			return firstRowProp;
		}
		for (i = 1; i < rowNum; i++){
			currentRowProp = this.getElem(i).getPhantomTableProp(propName);
			if (!firstRowProp.isTheSameAs(currentRowProp)){
				return null;
			}
		}
		return firstRowProp;

	};


	/**
	 * If the table is fragmented, then sets up the phantom properties and rearrange content property.
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
		this.phantomRowAttributes = this.getPhantomRowAttributes();
		this.phantomRowStyles = this.getPhantomRowStyles();
		this.phantomCellAttributes = this.getPhantomCellAttributes();
		this.phantomCellStyles = this.getPhantomCellStyles();
		this.phantomTableAttributes = this.getPhantomTableAttributes();
		this.phantomTableStyles = this.getPhantomTableStyles();
		for (i = 0; i < rowNum; i++){
			newContent.appendElem(this.getElem(i).getFirst().getFirst().getFirst());
		}
		this.content = newContent;
	};


}
Table.prototype = Object.create(Tag.prototype);