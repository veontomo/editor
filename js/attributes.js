/*jslint white: false */
/*jslint plusplus: true, white: true */

/** 
 * Produces a string of properties in inline-style fashion
 * This function is supposed to be added to prototypes of different objects.
 * It takse into consideration only properties, methods are ignored.
 * If attribite value is a number, the measurement unit will be appended.
 * @func  toString
 * @param   {Object}     	obj  	an object which string reperesentation should be generated.   
 * @param 	{String|null} 	unit 	a mesurement unit to be added to the numerical attribute values. By default, it is set to 'px'.
 * @return 	{String}		a concatenation of substrings; each substring is of this format: "attribute: value;".
 * @example The return value is of the form: "padding: 0px;margin: 10px;color: #ababab;"
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
 * @func  toString2
 * @param   {Object}    obj     
 * @return 	{String} 	String 		a union of substrings; each substring is of this format: 'attribute="value"', between the substrings there is a separator ' '.
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
 * @func  setMinMaxWidth
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
* Gets property value from the object.
* @func 	getProperty
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
* This class is supposed to characterize inline styles of html tags.
* @class  Style
*/
function Style() {
	"use strict"; 
	if (!(this instanceof Style)) {
		return new Style();
	}
	/**
	 * Generates string representation of this object (as inline styles)
	 * @method {String} 	toString 	string representation of this object
	 * @return {String} 	html-like string for this object
	 * @example The return value might be one of this form: style="width: 100px; color: red;"
	 */
	this.toString = function () {
		return toString(this);
	};
	/**
	 * Imposes the width, min-width and max-width
	 * @param {mixed} 	w  value of width
	 */
	this.setWidth = function (w) {
		setMinMaxWidth(this, w);
	};
}

/**
* This class is supposed to define attributes of html tags 
* @class  Attributes
*/
function Attributes() {
	"use strict";
	if (!(this instanceof Attributes)) {
		return new Attributes(); 
	} 
	/**
	 * Generates string representation of this object (as html attributes)
	 * @method {String} 	toString
	 * @return {String} 	html-like string for this object
	 * @example The return value might be one of this form: <b>class="example" id="tag"</b>
	 */
	this.toString = function () {
		return toString2(this);
	};
}

/**
* Table-specific attributes. 
* @extends Attributes
* @class  TableAttributes
*/
function TableAttributes(){
	"use strict";
	if (!(this instanceof TableAttributes)) {return new TableAttributes(); }
	/**
	 * Defines cellpadding attribute of the table
	 * @property 	{Number} 	cellpadding 	value of cell padding in px
	 * @default  	0
	 */
	this.cellpadding = 0;
	/**
	 * Defines cellspacing attribute of the table
	 * @property {Number} cellspacing 	value of cell spacing in px
	 * @default  0
	 */
	this.cellspacing = 0;
}
TableAttributes.prototype = new Attributes();

/** 
 * Text specific style class. 
 * @extends Style
 * @class  TextStyle
 */
function TextStyle() {
	"use strict";
	if (!(this instanceof TextStyle)) {
		return new TextStyle();
	}
	/**
	 * Font size
	 * @property {String} font-size 	Font size, including unit of measurement
	 * @default  "12px"
	 */
	this["font-size"] = "12px";
	/**
	 * Font color
	 * @property {String}	color 	Font color
	 * @default "#000000"
	 */
	this.color = "#000000";
	/**
	 * Font weight. Some possible values: "normal", "bold", "bolder", 100, 200, ..., 900. See html manuals for more info.
	 * @property {String|Integer} font-weight 	Font weight
	 * @default normal
	 */
	this["font-weight"] = "normal";
	/**
	 * Padding value along with unit of measurement
	 * @property {String} padding
	 * @default  "0px"
	 */
	this.padding = "0px";
	/**
	 * Margin value along with unit of measurement
	 * @property {String} margin
	 * @default  "0px"
	 */
	this.margin = "0px";
}
TextStyle.prototype = new Style();

/**
 * Represents hyperlink style.
 * @class  LinkStyle
 * @extends Style
 */
function LinkStyle() {
	"use strict";
	if (!(this instanceof LinkStyle)) {
		return new LinkStyle();
	}
	/**
	 * Text decoration attribute
	 * @property {String} text-decoration
	 * @default  "underline"
	 */
	this["text-decoration"] = "underline";

	/**
	 * Font size
	 * @property {String|Integer} font size
	 * @default 12
	 */
	this["font-size"] = 12;
	/**
	 * Font color attribute
	 * @property {String} font color
	 * @default  "blue"
	 */
	this.color = "blue";
	/**
	 * Font wieght attribute. See html manuals for possible values.
	 * @property {String|Integer} font weight
	 * @default  "normal"
	 */
	this["font-weight"] = "normal";
	/**
	 * Padding. If given as a number, the default measurment unit will be appended.
	 * @property {String|Number} padding
	 * @default  0
	 */
	this.padding = 0;
	/**
	 * Margin. If given as a number, the default measurment unit will be appended.
	 * @property {String|Number} margin
	 * @default  0
	 */
	this.margin = 0;
}
LinkStyle.prototype = new Style();

/**
 * Represents table style.
 * @class  TableStyle
 * @extends Style
 */
function TableStyle() {
	"use strict";
	if (!(this instanceof TableStyle)) {
		return new TableStyle();
	}
	/**
	 * Color of the border table
	 * @property {String} border-color
	 * @default  "rgb(255, 255, 255)"
	 */
	this["border-color"] = "rgb(255, 255, 255)";
	/**
	 * Style of the border table. See html manuals for possible values.
	 * @property {String} border-style
	 * @default  "solid"
	 */
	this["border-style"] = "solid";
	/**
	 * Width of the border table. If given as a number, the default measurment unit will be appended.
	 * @property {String|Number} border-width
	 * @default  0
	 */
	this["border-width"] = 0;
	/**
	 * Margin of the table. If given as a number, the default measurment unit will be appended.
	 * @property {String|Number} margin
	 * @default  0
	 */
	this.margin 	= 0;
	/**
	 * Padding of the table. If given as a number, the default measurment unit will be appended.
	 * @property {String|Number} padding
	 * @default  0
	 */
	this.padding 	= 0;
	/**
	 * Table width. If given as a number, the default measurment unit will be appended.
	 * @property {String|Number} width
	 * @default  0
	 */
	this.width 		= 0;
	/**
	 * Table maximal width. It is supposed to be equal to "width" property.
	 * @property {String|Number} max-width
	 * @default  0
	 */
	this["max-width"] 	= this.width;
	/**
	 * Table minimal width. It is supposed to be equal to "width" property.
	 * @property {String|Number} min-width
	 * @default  0
	 */
	this["min-width"] 	= this.width;

	/**
	 * Whether to collapse the table borders or not.
	 * @deprecated Do not use, because it causes problems in MS Outlook.
	 * @property {String} border-collapse
	 * @default  0
	 */
	// this['border-collapse'] = 'collapse';
}
TableStyle.prototype = new Style();

/**
 * Represents table row style.
 * @class  TableRowStyle
 * @extends Style
 */
function TableRowStyle() {
	"use strict";
	if (!(this instanceof TableRowStyle)) {
		return new TableRowStyle();
	}
	/**
	 * Color of the border table
	 * @property {String} border-color
	 * @default  "rgb(255, 255, 255)"
	 */
	this["border-color"] = "rgb(255, 255, 255)";
	/**
	 * Style of the border table. See html manuals for possible values.
	 * @property {String} border-style
	 * @default  "solid"
	 */
	this["border-style"] = "solid";
	/**
	 * Width of the border table. If given as a number, the default measurment unit will be appended.
	 * @property {String|Number} border-width
	 * @default  0
	 */
	this["border-width"] = 0;
	 /**
	  * Margin of the table. If given as a number, the default measurment unit will be appended.
	  * @property {String|Number} margin
	  * @default  0
	  */
	 this.margin 	= 0;
	 /**
	  * Padding of the table. If given as a number, the default measurment unit will be appended.
	  * @property {String|Number} padding
	  * @default  0
	  */
	 this.padding 	= 0;
	 /**
	  * Table width. If given as a number, the default measurment unit will be appended.
	  * @property {String|Number} width
	  * @default  0
	  */
	 this.width 		= 0;
	 /**
	  * Table maximal width. It is supposed to be equal to "width" property.
	  * @property {String|Number} max-width
	  * @default  0
	  */
	 this["max-width"] 	= this.width;
	 /**
	  * Table minimal width. It is supposed to be equal to "width" property.
	  * @property {String|Number} min-width
	  * @default  0
	  */
	 this["min-width"] 	= this.width;
}
TableRowStyle.prototype = new Style();

/**
 * Represents table cell styles.
 * @class	TableCellStyle
 * @extends	Style
 */
function TableCellStyle() {
	"use strict";
	if (!(this instanceof TableCellStyle)) {
		return new TableCellStyle();
	}
	/**
	 * Color of the border table
	 * @property {String} border-color
	 * @default  "rgb(255, 255, 255)"
	 */
	this["border-color"] = "rgb(255, 255, 255)";
	/**
	 * Style of the border table. See html manuals for possible values.
	 * @property {String} border-style
	 * @default  "solid"
	 */
	this["border-style"] = "solid";
	/**
	 * Width of the border table. If given as a number, the default measurment unit will be appended.
	 * @property {String|Number} border-width
	 * @default  "0px"
	 */
	this["border-width"] = "0px";
	/**
	 * Padding. If given as a number, the default measurment unit will be appended.
	 * @property {String|Number} padding
	 * @default  0
	 */
	this.padding = 0;
	/**
	 * Margin. If given as a number, the default measurment unit will be appended.
	 * @property {String|Number} margin
	 * @default  0
	 */
	this.margin = 0;
	/**
	 * Table width. If given as a number, the default measurment unit will be appended.
	 * @property {String|Number} width
	 * @default  0
	 */
	this.width = 0;
	/**
	 * Table minimal width. It is supposed to be equal to "width" property.
	 * @property {String|Number} min-width
	 * @default  0
	 */
	this["max-width"] = this.width;
	/**
	 * Table minimal width. It is supposed to be equal to "width" property.
	 * @property {String|Number} min-width
	 * @default  0
	 */
	this["min-width"] = this.width;
	/**
	 * Vertical align of the cell content.
	 * @property {String} vertical-align
	 * @default  0
	 */
	this['vertical-align'] = 'top';
}
TableCellStyle.prototype = new Style();

/**
 * Represents image styles.
 * @class	ImageStyle
 * @extends	Style
 */
function ImageStyle() {
	"use strict";
	if (!(this instanceof ImageStyle)) {
		return new ImageStyle();
	}
	/**
	 * Width of the border around the image. If given as a number, the default measurment unit will be appended.
	 * @property {String|Number} border-width
	 * @default  0
	 */
	this["border-width"] = 0;
	/**
	 * Style of the border around the image. See html manuals for possible values.
	 * @property {String} border-style
	 * @default  "solid"
	 */
	this["border-style"] = "solid";
	/**
	 * Color of the border around the image.
	 * @property {String} border-color
	 * @default  "rgb(255, 255, 255)"
	 */
	this["border-color"] = "rgb(255, 255, 255)";
	/**
	 * Padding. If given as a number, the default measurment unit will be appended.
	 * @property {String|Number} padding
	 * @default  0
	 */
	this.padding = 0;
	/**
	 * Margin. If given as a number, the default measurment unit will be appended.
	 * @property {String|Number} margin
	 * @default  0
	 */
	this.margin = 0;
	/**
	 * Image width. If given as a number, the default measurment unit will be appended.
	 * @property {String|Number} width
	 * @default  0
	 */
	this.width = 0;
	/**
	 * Image height. If given as a number, the default measurment unit will be appended.
	 * @property {String|Number} height
	 * @default  0
	 */
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
 * This class is used to encompass other objects.
 * @class  		Content
 * @param 		{String} 	str 		an optional argument that will be inserted when creating property "elements".
 */
function Content(str) {
	"use strict";
	if (!(this instanceof Content)) {
		return new Content();
	}
	/**
	 * Container of items. If an item has a method "toHtml", it will be applied when transforming the whole Content object into a string.
	 * @property {Array} elements
	 * @default  [str]
	 */
	this.elements = str ? [str] : [];

	/**
	 * The number of items in the "elements" property
	 * @method length
	 * @return {Integer}
	 */
	this.length = function () {
		return this.elements.length;
	};
	/**
	 * Transforms the object into html form.  If item of the "elements" property is of Object type, then it should have "toHtml" method which is to be applied to the item. 
	 * @method toHtml
	 * @return {String} 
	 */
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
 * Represents a table cell. The argument is supposed to be passed to the "content" property.
 * @param {mixed} arg 
 * @class  Cell
 */
function Cell(arg) {
	"use strict";
	if (!(this instanceof Cell)) {
		return new Cell(arg);
	}
	/**
	 * Attributes of the cell. 
	 * @property {Attributes} attr
	 * @type {Attributes}
	 * @default Attributes
	 */
	this.attr = new Attributes();
	/**
	 * Styles of the cell
	 * @property {TableCellStyle} style
	 * @type {TableCellStyle}
	 * @default TableCellStyle
	 */
	this.style = new TableCellStyle();
	/**
	 * Content of the cell
	 * @property {Content} content
	 * @type {Content}
	 * @default Content
	 */
	this.content = new Content(arg);
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
	 * Generates cell-specific html code with corresponding attributes and styles
	 * @method toHtml
	 * @return {String} html representation of the cell
	 */
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
 * Represents a table row
 * @class  Row
 */
function Row() {
	"use strict";
	if (!(this instanceof Row)) {
		return new Row();
	}
	/**
	* Attributes of the row. 
	* @property {Attributes} attr
	* @type {Attributes}
	* @default Attributes
	*/
	this.attr = new Attributes();
	/**
	 * Styles of the row
	 * @property {TableCellStyle} style
	 * @type {TableCellStyle}
	 * @default TableRowStyle
	 */
	this.style = new TableRowStyle();
	/**
	 * Array of cells belonging to the row.
	 * @property {Array} cells  array of Cell instances or empty array
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
}

/** 
* Represents table.
* @class  Table
*/
function Table() {
	"use strict";
	if (!(this instanceof Table)) {
		return new Table();
	}
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
	 * Generates table-specific html code with corresponding attributes and styles. Creation of the row-related html of each row is delegated to Row::toHtml()
	 * @method toHtml
	 * @return {String} html representation of the row
	 */
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