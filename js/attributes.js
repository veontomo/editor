/*jslint white: false */
/*jslint plusplus: true, white: true */
/** 
 * Produces a string of properties in inline-style fashion
 * This function is supposed to be added to prototypes of different objects.
 * It takse into consideration only properties, methods are ignored.
 * If attribite value is a number, the measurement unit will be appended.
 * @param   {Object}     	obj  	an object which string reperesentation should be generated.   
 * @param 	{String|null} 	unit 	a mesurement unit to be added to the numerical attribute values. By default, it is set to 'px'.
 * @return 	{String}		a concatenation of substrings; each substring is of this format: "attribute: value;".
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
 * @param   {Object}    obj     
 * @return 	{String} 	String 			a union of substrings; each substring is of this format: 'attribute="value"', btw the substrings there is a separator ' '.
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
 * @param 	{Object} 	obj 		object which width is to be set.
 * @param 	{mixed} 	w			width value
 * @return 	{void}
 */
var setMinMaxWidth = function (obj, w) {
	"use strict";
	if(typeof obj !== 'object'){
		throw new Error('Can not set a property of a non-object!');
	} 
	if(w === undefined){
		throw new Error("Width value is not set!"); 
	}
	obj.width = w; 
	obj['max-width'] =  w; 
	obj['min-width'] =  w; 
}; 

/** 
* Gets property from the object.
* @param 	{Object} 	obj 	an object
* @param 	{String} 	prop 	property name to retrieve
* @return 	{mixed} 	property value of the object
*/
function getProperty(obj, prop){
	"use strict";
	if(typeof obj !== 'object'){
		throw new Error('Not an object!');
	} 
	if(prop === undefined){
		throw new Error("Property name missing!"); 
	}
	if(obj.hasOwnProperty(prop)){
		return obj[prop];
	}
}

/**
* Style object. To be used as inline style of html tags. 
* @example 	<... style="width: 100px; color: red;">
* @method {String} 	toString 	string representation of the Style
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
* @example 	<... class="example" id="tag" ... >
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
 * @param 		{String} 	str 		a string that will be inserted by default in the array "elements".
 * @property 	{Array} 	elements 	array of objects or strings
 * @method 		{String} 	toHtml()	string representation of the class. If an element of "elements" property is of type Object, it must respond to 'toHtml' method.
 * @method 		{Integer} 	length()	number of the elements
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
				output += elem.hasOwnProperty('toHtml') ? elem.toHtml() : '<!-- no html representation -->';
				break;
			}
		}
		return output;
	};
}


/**
 * Table cell.
 * @property 	{Object}	attr 						cell attributes
 * @property 	{Object}	style 						cell styles
 * @property 	{Object}	content 					cell content (an instance of Content())
 * @method 		{String} 	styleProperty(String) 		gets the property of the row from the its style
 * @method 		{void}		setWidth(Number)		 	sets width of the cell, updating correspondingly the "attr" and "style" properties 
 * @method 		{String}	toHtml() 					html representation of the element
 */

function Cell() {
	"use strict";
	if (!(this instanceof Cell)) {
		return new Cell();
	}
	this.attr = new Attributes();
	this.style = new TableCellStyle();
	this.content = new Content();
	// is it all worth it?!
	this.styleProperty = function (prop) {
		return getProperty(this.style, prop);
	};
	// insert the width parameter inside the Attribute and Style properties
	this.setWidth = function(w){
		setMinMaxWidth(this.style, w);
		this.attr.width = w;
	};

	this.toHtml = function () {
		var tag = 'td',
			cellHtml, 
			attr = this.attr.toString(),
			style = this.style.toString();
		if (style){
			style = 'style="' + style + '"';
		}
		cellHtml = '<' + [tag, attr, style].join(' ').replace(/\s+/g, ' ').trim() + '>' ;
		cellHtml += this.content.toHtml();
		cellHtml += '</' + tag + '>';
		return cellHtml;
	};
}

/** 
 * Table row.
 * @property 	{Object} 			attr						row attributes
 * @property 	{Object} 			style 						row styles
 * @property 	{Array} 			cells 						array of Cell instances
 * @method 		{String} 			styleProperty(String) 		gets the property of the row from the its style.
 * @method 		{void}				setWidth(Number) 			sets width of the cell, writing value of "width" both to the attribute and style properties 
 * @method 		{String} 			toHtml() 					html representation of the element
 */
function Row() {
	"use strict";
	if (!(this instanceof Row)) {
		return new Row();
	}
	this.attr = new Attributes();
	this.style = new TableRowStyle();
	this.cells = [];

	// is it all worth it?!
	this.styleProperty = function (prop) {
		return getProperty(this.style, prop);
	};

	// insert the width parameter inside the Attribute and Style properties
	this.setWidth = function(w){
		setMinMaxWidth(this.style, w);
		this.attr.width = w;
	};

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
}
/** 
* Table. The table rows should have the same number of cells.
* @property 	{Object} 	attr 					table attributes
* @property 	{Object} 	style 					table styles
* @property 	{Array} 	rows 					array of Row() instances
* @property 	{Array} 	content 				two-dimensional array. Each element of the array is an instance of Content().
* @method 		{String} 	styleProperty(String)	gets the property of the row from the its style.
* @method 		{void}		setWidth(Number) 		sets width of the cell, writing value of "width" both to the attribute and style properties 
* @method 		{String} 	toHtml() 				html representation of the table
*/
function Table() {
	"use strict";
	if (!(this instanceof Table)) {
		return new Table();
	}
	this.attr = new TableAttributes();
	this.style = new TableStyle();
	this.rows = [];

	// is it all worth it?!
	this.styleProperty = function (prop) {
		return getProperty(this.style, prop);
	};

	// insert the width parameter inside the Attribute and Style properties
	this.setWidth = function(w){
		setMinMaxWidth(this.style, w);
		this.attr.width = w;
	};
	
	this.toHtml = function () {
		var i, tableAttr, tableStyle, htmlTable, rowsNumber,
			tag = 'table';
		tableAttr = this.attr.toString();
		tableStyle = this.style.toString();
		if (tableStyle){
			tableStyle = 'style="' + tableStyle + '"';
		}
		htmlTable = '<' + [tag, tableAttr, tableStyle].join(' ').replace(/\s+/g, ' ').trim() + '>';
		rowsNumber = this.rows.length;
		for (i = 0; i < rowsNumber; i++) {
			htmlTable += this.rows[i].toHtml();
		}
		htmlTable += '</' + tag + '>';
		return htmlTable;
	};
}