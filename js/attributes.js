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
 * Produces a string of attributes and values
 * It takse into consideration only properties, methods are ignored.
 * If attribite value is a number, the measurement unit will be appended.
 * @param   obj     Object     
 * @return 			String 			a union of substrings; each substring is of this format: 'attribute="value"', btw the substrings there is a separator ' '.
  */
var toString2 = function (obj) {
		"use strict";
		var val, valType, attr, output = [];
		for (attr in obj) {
			if (obj.hasOwnProperty(attr)) {
				val = obj[attr];
				valType = typeof val;
				// avoid adding method to the output
				if (valType === 'string' || valType === 'number'){
					output.push(attr + '="' + String(val) + '"');	
				}
			}
		}
		return output.join(' ');
	};


/**
 * Sets width, min-width and max-width of the object.
 * @param 	obj 	Object 		object which width is to be set.
 * @param 	w 		mixed		width value
 * @return void
 */
var setMinMaxWidth = function (obj, w) {
	"use strict";
	if(typeof obj !== 'object'){
		throw new Error('Can not set a property of a non-object!');
	} if(w === undefined){
		throw new Error("Width value is not set!"); 
	}
	obj.width = w; 
	obj['max-width'] =  w; 
	obj['min-width'] =  w; 
}; 

/**
* Style object. To be used as inline style of html tags
*/
function Style() {
	"use strict"; 
	if (!(this instanceof Style)) {return new Style(); } 
	this.toString = function () {
		return toString(this);
	};
	this.setWidth = function (w) {
		setMinMaxWidth(this, w);
	};
}

/**
* Attribute object. To be used as inline attributes of html tags
*/
function Attributes() {
	"use strict";
	if (!(this instanceof Attributes)) {return new Attributes(); } 
	this.toString = function () {
		return toString2(this);
	};
}

/**
* Table attribute object. To be used as inline attributes of html tags
*/
function TableAttributes(){
	"use strict";
	if (!(this instanceof TableAttributes)) {return new TableAttributes(); }
	this.cellpadding = 0;
	this.cellspacing = 0;
}

TableAttributes.prototype = new Attributes();

/** 
 * Some data containers with default values of their Style.
 */
function TextStyle() {
	"use strict";
	if (!(this instanceof TextStyle)) {
		return new TextStyle();
	}
	this["font-size"] = "12px";
	this.color = "#000000";
	this["font-weight"] = "0";
	this.padding = "0px";
	this.margin = "0px";
}
TextStyle.prototype = new Style();

function LinkStyle() {
	"use strict";
	if (!(this instanceof LinkStyle)) {
		return new LinkStyle();
	}
	this["text-decoration"] = "underline";
	this["font-size"] = 12;
	this.color = "blue";
	this["font-weight"] = 0;
	this.padding = 0;
	this.margin = 0;
}
LinkStyle.prototype = new Style();

function TableStyle() {
	"use strict";
	if (!(this instanceof TableStyle)) {
		return new TableStyle();
	}
	this["border-color"] = "rgb(255, 255, 255)";
	this["border-style"] = "solid";
	this["border-width"] = 0;
	this.margin 	= 0;
	this.padding 	= 0;
	this.width 		= 0;
	this["max-width"] 	= this.width;
	this["min-width"] 	= this.width;
	// this['border-collapse'] = 'collapse';
}
TableStyle.prototype = new Style();

function TableRowStyle() {
	"use strict";
	if (!(this instanceof TableRowStyle)) {
		return new TableRowStyle();
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
TableRowStyle.prototype = new Style();

function TableCellStyle() {
	"use strict";
	if (!(this instanceof TableCellStyle)) {
		return new TableCellStyle();
	}
	this["border-color"] = "rgb(255, 255, 255)";
	this["border-style"] = "solid";
	this["border-width"] = "0px";
	this.margin = 0;
	this.padding = 0;
	this.width = 0;
	this["max-width"] = this.width;
	this["min-width"] = this.width;
	this['vertical-align'] = 'top';
}
TableCellStyle.prototype = new Style();

function ImageStyle() {
	"use strict";
	if (!(this instanceof ImageStyle)) {
		return new ImageStyle();
	}
	this["border-width"] = 0;
	this["border-style"] = "solid";
	this["border-color"] = "rgb(255, 255, 255)";
	this.padding = 0;
	this.margin = 0;
	this.width = 0;
	this.height = 0;
}
ImageStyle.prototype = new Style();

function ListStyle() {
	"use strict";
	if (!(this instanceof ListStyle)) {
		return new ListStyle();
	}
	this.padding = 0;
	this.margin = 0;
}
ListStyle.prototype.toString = new Style();

function ListItemStyle() {
	"use strict";
	if (!(this instanceof ListItemStyle)) {
		return new ListItemStyle();
	}
	this["font-size"] = 12;
	this.color = "#000000";
	this["font-weight"] = 0;
	this.padding = 0;
	this.margin = 0;
}
ListItemStyle.prototype.toString = new Style();


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
	this.style = new TableCellStyle();
	this.width = function () {
		return this.style.width;
	};
	this.content = new Content();
	this.toHtml = function () {
		return '<td style="' + this.style.toString() + '">' + this.content.toHtml() + '</td>';
	};
}

/** 
 * Table row. Contains style attribute and array of table cells.
 * @property 	style 				Object 						the row Style
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
	this.style = new TableRowStyle();
	this.content = [];

	this.width = function () {
		return this.style.hasOwnProperty('width') ? this.style.width : '';
	};

	this.toHtml = function () {
		var i, htmlRow = '<tr style="' + this.style.toString() + '">',
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
	this.attributes = new TableAttributes();
	this.style = new TableStyle();
	this.rowStyle = new TableRowStyle();
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

	this.attributesString = function(){
		var width = this.style.width;
		var ta = this.attributes;
		ta.width = width;
		return ta.toString();
	}

	this.toHtml = function () {
		var output, len, i,
			tableTag = 'table';
		output = '<' + tableTag + ' ' + this.attributesString() + ' style="' + this.style.toString() + '"><tbody>';
		len = this.rows().length;
		for (i = 0; i < len; i++) {
			output += this.rows()[i].toHtml();
		}
		output += '</tbody></' + tableTag + '>';
		return output;
	};

	this.width = function () {
		return this.style.hasOwnProperty('width') ? this.style.width : '';
	};
}