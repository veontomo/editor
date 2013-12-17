/*jslint white: false */
/*jslint plusplus: true, white: true */
/** 
 * Produces a string of properties in inline-style fashion
 * This function is supposed to be added to prototypes of different objects.
 * It takse into consideration only properties, methods are ignored.
 * If attribite value is a number, the measurement unit will be appended.
 * @param   obj     Object     
 * @param 	unit 	String|null 	a mesurement unit to be added to the numerical attribute values. By default, it is set to 'px'.
 * @return 			String 			a concatenation of substrings; each substring is of this format: "attribute: value;".
 * @example "padding: 0px;margin: 10px;color: #ababab;"
 */
var toString = function (obj, unit) {
		"use strict";
		var val, attr, styles = "";
		unit = unit || 'px';
		for (attr in obj) {
			if (obj.hasOwnProperty(attr)) {
				// avoid adding method to the output
				val = obj[attr];
				switch (typeof val) {
				case 'string':
					styles += attr + ': ' + val + ';';
					break;
				case 'number':
					styles += attr + ': ' + String(val) + unit + ';';
					break;
				}
			}
		}
		return styles;
	};

/**
 * Sets width, min-width and max-width to the value given as the argument.
 * This function is supposed to be added to prototypes of different objects.
 * @param mixed w
 * @return void
 */
var setMinMaxWidth = function (obj, w) {
		"use strict";
		obj.width = w;
		obj["max-width"] = obj.width;
		obj["min-width"] = obj.width;
	};

function Attributes() {
	"use strict";
	if (!(this instanceof Attributes)) {
		return new Attributes();
	}
	this.toString = function () {
		return toString(this);
	};
	this.setWidth = function (w) {
		return setMinMaxWidth(this, w);
	};
}

/** 
 * Some data containers with default values of their attributes.
 */

function TextAttributes() {
	"use strict";
	if (!(this instanceof TextAttributes)) {
		return new TextAttributes();
	}
	this["font-size"] = "12px";
	this.color = "#000000";
	this["font-weight"] = "0";
	this.padding = "0px";
	this.margin = "0px";
}
TextAttributes.prototype = new Attributes();

function LinkAttributes() {
	"use strict";
	if (!(this instanceof LinkAttributes)) {
		return new LinkAttributes();
	}
	this["text-decoration"] = "underline";
	this["font-size"] = 12;
	this.color = "blue";
	this["font-weight"] = 0;
	this.padding = 0;
	this.margin = 0;
}
LinkAttributes.prototype = new Attributes();

function TableAttributes() {
	"use strict";
	if (!(this instanceof TableAttributes)) {
		return new TableAttributes();
	}
	this["border-color"] = "rgb(255, 255, 255)";
	this["border-style"] = "solid";
	this["border-width"] = 0;
	this.margin = 0;
	this.padding = 0;
	this.width = 0;
	this["max-width"] = this.width;
	this["min-width"] = this.width;
}
TableAttributes.prototype = new Attributes();

function FramedTableAttributes() {
	"use strict";
	if (!(this instanceof FramedTableAttributes)) {
		return new FramedTableAttributes();
	}
	this['border-width'] = 1;
	this['border-color'] = 'rgb(0, 0, 0)';
}
FramedTableAttributes.prototype = new TableAttributes();

function TableRowAttributes() {
	"use strict";
	if (!(this instanceof TableRowAttributes)) {
		return new TableRowAttributes();
	}
	this["border-color"] = "rgb(255, 255, 255)";
	this["border-style"] = "solid";
	this["border-width"] = 0;
	this.margin = 0;
	this.padding = 0;
	this.width = 0;
	this["max-width"] = this.width;
	this["min-width"] = this.width;
}
TableRowAttributes.prototype = new Attributes();

function TableCellAttributes() {
	"use strict";
	if (!(this instanceof TableCellAttributes)) {
		return new TableCellAttributes();
	}
	this["border-color"] = "rgb(255, 255, 255)";
	this["border-style"] = "solid";
	this["border-width"] = "0px";
	this.margin = 0;
	this.padding = 0;
	this.width = 0;
	this["max-width"] = this.width;
	this["min-width"] = this.width;
}
TableCellAttributes.prototype = new Attributes();

function ImageAttributes() {
	"use strict";
	if (!(this instanceof ImageAttributes)) {
		return new ImageAttributes();
	}
	this["border-width"] = 0;
	this["border-style"] = "solid";
	this["border-color"] = "rgb(255, 255, 255)";
	this.padding = 0;
	this.margin = 0;
	this.width = 0;
	this.height = 0;
}
ImageAttributes.prototype = new Attributes();

function ListAttributes() {
	"use strict";
	if (!(this instanceof ListAttributes)) {
		return new ListAttributes();
	}
	this.padding = 0;
	this.margin = 0;
}
ListAttributes.prototype.toString = new Attributes();

function ListItemAttributes() {
	"use strict";
	if (!(this instanceof ListItemAttributes)) {
		return new ListItemAttributes();
	}
	this["font-size"] = 12;
	this.color = "#000000";
	this["font-weight"] = 0;
	this.padding = 0;
	this.margin = 0;
}
ListItemAttributes.prototype.toString = new Attributes();


/**
 * Content class.
 * @param 		str 		String 		a sring that will be inserted by default in the array "elements".
 * @property 	elements 	Array 		array of objects or strings
 * @method 		String 		toHtml()	string representation of the class. Each element should respond to 'toHtml' method.
 */

function Content(str) {
	"use strict";
	if (!(this instanceof Content)) {
		return new Content();
	}
	this.elements = str ? [str] : [];
	this.length = function () {
		return this.elements.length;
	};
	this.toHtml = function () {
		var i, elem, output = '',
			len = this.length();
		for (i = 0; i < len; i++) {
			elem = this.elements[i];
			switch (typeof elem) {
			case 'string':
				output += elem;
				break;
			case 'number':
				output += elem.toString();
				break;
			case 'object':
				output += elem.hasOwnProperty('toHtml') ? elem.toHtml() : ' no string representation for the element! ';
				break;
			}
		}
		return output;
	};
}


/**
 * Table cell. It is completely characterized by its styles.
 * @property 	style 				Object 	TableCellAttribute
 * @property 	content 			Object 	content of the cell.
 * @method 		toHtml() 			String 	html representation of the element
 */

function Cell() {
	"use strict";
	if (!(this instanceof Cell)) {
		return new Cell();
	}
	this.style = new TableCellAttributes();
	this.width = function () {
		return this.style.width;
	};
	this.content = new Content();
	this.toHtml = function () {
		return '<td width="' + this.width() + '" style="' + this.style.toString() + '">' + this.content.toHtml() + '</td>';
	};
}

/** 
 * Table row. Contains style attribute and array of table cells.
 * @property 	style 				Object 						the row attributes
 * @property 	cellStyles 			Array 						array of TableCellAttribute instances
 * @property 	content 			Array 						array of Content instances
 * @method 		String 				width() 					gets the width of the row from the style attribute. If not set, empty string is returned.
 * @method 		String 				toHtml() 					html representation of the element
 * @method 		Integer				numOfCells() 				the number of cells in the row
 * @method 		Array				cells 						array of Cell instances. "style" property of each element is equal to the corresp. element of "cellStyles" of this instance,
 * and "content" property is equal to the corresp. elem of "content" if this instance.
 * @method 		Object|null 		dropCell(Number) 			removes the element from the array of the cells
 * @method  	void				insertCell(Object, Number)	inserts cell into the given position of the row. If the position is not a valid index, then
 * the cell will be appended to the end of cell array.
 * @method  	void				appendCell(Object)			appends the cell to the row cells
 */
function Row() {
	"use strict";
	if (!(this instanceof Row)) {
		return new Row();
	}
	this.style = new TableRowAttributes();
	this.content = [];

	this.width = function () {
		return this.style.hasOwnProperty('width') ? this.style.width : '';
	};

	this.toHtml = function () {
		var i, htmlRow = '<tr width="' + this.width() + '" style="' + this.style.toString() + '">',
			cellsNumber = this.numOfCells();
		for (i = 0; i < cellsNumber; i++) {
			htmlRow += this.cells()[i].toHtml();
		}
		htmlRow += '</tr>';
		return htmlRow;

	};
	this.numOfCells = function () {
		return this.content.length;
	};

	this.cells = function () {
		var i, cell, output = [],
			len = this.numOfCells();
		for (i = 0; i < len; i++) {
			cell = new Cell();
			cell.style = this.cellStyles[i];
			cell.content = this.content[i];
			output.push(cell);
		}
		return output;
	};

	this.dropCell = function (num) {
		var elem = this.cells[num];
		if (elem !== undefined) {
			this.content.splice(num, 1);
			return elem;
		}
	};

	this.insertCell = function (cell, pos) {
		var elem = this.content[pos];
		if (elem !== undefined) {
			this.content.splice(pos, 0, cell);
		} else {
			this.content.push(cell);
		}
	};

	this.appendCell = function (cell) {
		this.insertCell(cell, this.length());
	};
}

/** 
* Table. The table rows should have the same number of cells.
* @property 	style 		Object 		table styles
* @property 	rowStyle 	Object 		the style of each row of the table
* @property 	cellStyles 	Array 		each element of the array is a cell style object
* @property 	content 	Array 		two-dimensional array. Each element of the array is an instance of Content().
* @method 		Number 		numOfCols()	the number of columns in the first row. It is retrieved from the property "content".
* @method 		Number 		numOfRows()	the number of table rows. It is retrieved from the property "content".
* @method 		Array 		rows() 		array, each element of which is an instance of Row, which "style" property is equal to "rowStyle" one of this instance, 
* "cellStyles" is equal to "cellStyles" of this instance, "content" is equal to corresponding sub-element of "content" of this instance.
* @method 		Boolean 	isRegular 	true, if each element of the property "content" contains arrays of the same length. False otherwise.
* @method 		Number 		width()		table width. It is retrieved from the "style" property.
* @method 		String 		toHtml() 	html representation of the table
*/
function Table() {
	"use strict";
	if (!(this instanceof Table)) {
		return new Table();
	}
	this.style = new TableAttributes();
	this.rowStyle = new TableRowAttributes();
	this.cellStyles = [];
	this.content = [];
	this.numOfCols = function () {
		return this.content[0].length;
	};
	this.numOfRows = function () {
		return this.content.length;
	};

	this.isRegular = function () {
		var isAllArrays, firstRowLength;
		// check if each element is an array
		isAllArrays = this.content.every(function (elem) {
			return Array.isArray(elem);
		});
		if (!isAllArrays) {
			return false;
		}
		firstRowLength = this.content[0].length;
		return this.content.every(function (arr) {
			return arr.length === firstRowLength;
		});
	};

	this.rows = function () {
		var i, row, output = [],
			len = this.numOfRows();
		for (i = 0; i < len; i++) {
			row = new Row();
			row.style = this.rowStyle;
			row.cellStyles = this.cellStyles;
			row.content = this.content[i];
			output.push(row);
		}
		return output;
	};

	this.toHtml = function () {
		var output, len, i;
		output = '<table width="' + this.width() + '" style="' + this.style.toString() + '"><tbody>';
		len = this.rows().length;
		for (i = 0; i < len; i++) {
			output += this.rows()[i].toHtml();
		}
		output += '</tbody></table>';
		return output;
	};

	this.width = function () {
		return this.style.hasOwnProperty('width') ? this.style.width : '';
	};
}

function PlainTable() {
	"use strict";
	if (!(this instanceof PlainTable)) {
		return new PlainTable();
	}
}
PlainTable.prototype = new Table();

function FramedTable() {
	"use strict";
	if (!(this instanceof FramedTableAttributes)) {
		return new FramedTableAttributes();
	}
	this.style = new FramedTableAttributes();
}
FramedTable.prototype = new Table();