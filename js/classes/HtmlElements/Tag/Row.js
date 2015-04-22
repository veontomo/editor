/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global Attributes, Cell, Table, TableRowStyles, Tag, Content, Unit */

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
	this.setProperties(new RowProperties());

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
	 * @method         appendCell
	 * @param          {Cell}               cell            a cell to be appended. If not a Cell instance, an error is thrown.
	 * @return         {void}
	 */
	this.appendCell = function(cell){
		if (!(cell instanceof Cell)){
			throw new Error('The argument is not a Cell instance!');
		}
		this.appendElem(cell);
	};

	/**
	 * Returns `true` if the row contains only one cell and this cell contains only one element
	 * that is a {{#crossLink "Table"}}Table{{/crossLink}} instance. Otherwise, `false` is returned.
	 * @method         onlyTableInside
	 * @return         {Boolean}
	 */
	this.onlyTableInside = function(){
		var cell = this.getFirst();
		if (cell === undefined || this.cellNum() !== 1 || cell.length() !== 1){
			return false;
		}
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
	 * Drops the cell at the given position and resizes the remaining cells. If the cell to drop has a nieghbour to its
	 * right, then the freed space isassigned to that neighbour, otherwise it is assigned to the left neighbour:
	 * <pre>
     * |xxx| a | b   | c |   ->   |     a | b   | c |
     * | a |xxx| b   | c |   ->   | a |     b   | c |
     * | a | b | c | xxx |   ->   | a | b | c       |
     * </pre>
	 * If the cell to drop does not exist, the row remains unchanged.
	 * @method         knockOutCell
	 * @param          {Number}             cellNum         cell number to delete. Numeration starts with 0.
	 * @return         {void}
	 */
	this.knockOutCell = function(cellNum){
		var acceptor, acceptorWidth, currentCell, currentCellWidth, widthTotal, acceptorWidthObj, currentCellWidthObj;
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
				acceptorWidthObj  = new Unit(acceptorWidth);
				currentCellWidthObj  = new Unit(currentCellWidth);
				widthTotal = acceptorWidthObj.add(currentCellWidthObj);
				acceptor.setWidth(widthTotal.getValue());
			}
			this.dropElemAt(cellNum);
		}
	};

	/**
	 * Appends style to a given cell of the row. Alias for Tag::appendStyleToElemAt().
	 * @method         appendStyleToCellAt
	 * @param          {Number}             cellNum       index of the target cell
	 * @param          {any}                stl           style to be appended
	 * @return         {void}
	 */
	this.appendStyleToCellAt = function (cellNum, stl){
		this.appendStyleToElemAt(cellNum, stl);
	};



	/**
	 * This is an alias for {{#crossLink "Row/getPhantomCellProp:method"}}getPhantomCellProp('style'){{/crossLink}}.
	 * @method         phantomCellStyles
	 * @return         {Style}
	 */
	this.phantomCellStyles = function(){
		return this.getPhantomCellProp('style');
	};

	/**
	 * This is an alias for {{#crossLink "Row/getPhantomCellProp:method"}}getPhantomCellProp('attr'){{/crossLink}}.
	 * @method         phantomCellAttr
	 * @return         {Attributes}
	 */
	this.phantomCellAttr = function(){
		return this.getPhantomCellProp('attr');
	};

	/**
	 * If the row corresponds to a framed row (a row for which method
	 * {{#crossLink "Row/onlyTableInside:method"}}onlyTableInside{{/crossLink}} returns `true`), then
	 * {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} or
	 * {{#crossLink "Tag/attributes:property"}}attributes{{/crossLink}} is returned.
	 * @method         getPhantomCellProp
	 * @param          {String}             prop         "style" or "attr"
	 * @return         {Properties}
	 */
	this.getPhantomCellProp = function(prop){
		if (this.onlyTableInside()){
			if (prop === 'style'){
				return this.getFirst().getStyles();
			}
			if (prop === 'attr'){
				return this.getFirst().getProperties();
			}
		}
	};

	/**
	 * If the row corresponds to a framed row (a row for which method
	 * {{#crossLink "Row/onlyTableInside:method"}}onlyTableInside{{/crossLink}} returns true),
	 * then {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} or
	 * {{#crossLink "Tag/attributes:property"}}attributes{{/crossLink}} of the table inside first cell of current row is returned.
	 * @method         getPhantomTableProp
	 * @param          {String}             prop        "style" or "attr"
	 * @return         {Properties}
	 */
	this.getPhantomTableProp = function(prop){
		// inside the row there is a cell, inside which there is a table
		if (this.onlyTableInside()){
			if (prop === 'style'){
				return this.getFirst().getFirst().getStyles();
			}
			if (prop === 'attr'){
				return this.getFirst().getFirst().getProperties();
			}
		}
	};


	/**
	 * If the row corresponds to a framed row (a row for which method
	 * {{#crossLink "Row/onlyTableInside:method"}}onlyTableInside{{/crossLink}}
	 * returns `true`), then style of the table inside the cell is returned.
	 * This is an alias for {{#crossLink "Row/getPhantomTableProp:method"}}getPhantomTableProp('style'){{/crossLink}}
	 * method.
	 * @method         phantomTableStyles
	 * @return         {Style}
	 */
	this.phantomTableStyles = function(){
		return this.getPhantomTableProp('style');
	};

	/**
	 * If the row corresponds to a framed row (a row for which method
	 * {{#crossLink "Row/onlyTableInside:method"}}onlyTableInside{{/crossLink}}
	 * returns `true`), then attribute of the table inside the cell is returned.
	 * This is an alias for {{#crossLink "Row/getPhantomTableProp:method"}}getPhantomTableProp('attr'){{/crossLink}}.
	 * @method         phantomTableAttr
	 * @return         {Properties}
	 */
	this.phantomTableAttr = function(){
		return this.getPhantomTableProp('attr');
	};

	/**
	 * Inserts `c` cells into the row. If `fun` is a function, it recieves as an argument
	 * the number of cell and its output is then inserted into cell content.
	 *
	 * Previous row content gets lost.
	 *
	 * @method         makeShape
	 * @param          {Integer}       c     number of cells
	 * @param          {Function}      fun   [optional] function whose output is to be set as cell content
	 * @return         {void}
	 * @since          0.0.6
	 */
	this.makeShape = function(c, fun){
		if (c === undefined){
			throw new Error('Number of cells is missing.');
		}
		if (parseInt(c, 10) !== c || c <= 0){
			throw new Error('Number of cells must be positive integer.');
		}
		var needToMark = typeof fun === 'function';
		this.flushContent();
		var i, cell;
		for (i = 0; i < c; i++){
			cell = new Cell();
			if (needToMark){
				cell.setContent(fun(i));
			}
			this.appendCell(cell);
		}
	};

	/**
	 * Sets top border for each cell.
	 * @method         setCellTopBorder
	 * @param          {String}        borderInfo       border description (e.g., "1px solid red")
	 * @since          0.0.6
	 */
	this.setCellTopBorder = function(borderInfo){
		var cntn = new Content(),
			cellNum = this.cellNum(),
			c, cell;
		for (c = 0; c < cellNum; c++){
			cell = this.getElem(c);
			cell.setStyleProperty('border-top', borderInfo);
			cntn.appendElem(cell);
		}
		this.setContent(cntn);
	};


	/**
	 * Inflates row with cells.
	 *
	 * @method         inflate
	 * @param          {Array}         cells  array of {{#crossLink "Cell"}}Cell{{/crossLink}} instances
	 * @return         {void}
	 * @since          0.2.6
	 */
	this.inflate = function(cells){
		cells.forEach(function(cell){
			console.log(cell);
			this.appendCell(cell);
		}.bind(this));
	};



}
Row.prototype = Object.create(Tag.prototype);

/**
 * {{#crossLink "Row"}}Row{{/crossLink}}'s class characteristic function.
 *
 * It returns `true` if the argument "corresponds" to an object which class UList is designed
 * to represent.
 * @method        characteristicFunction
 * @param         {Any}               n
 * @return        {Boolean}
 * @since         0.2.0
 */
Row.prototype.characteristicFunction = function(n){
	return (n instanceof Element) && n.tagName.toLowerCase() === 'tr';
};