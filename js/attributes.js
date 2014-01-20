/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global DOMParser */

/**
 * Produces a string of properties in inline-style fashion
 * This function is supposed to be added to prototypes of different objects.
 * It takse into consideration only properties, methods are ignored.
 * If attribite value is a number, the measurement unit will be appended.
 * @module 	attributes
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
 * @module 	attributes
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
 * Sandwiches the midlle string with the left and the right ones. If the middle one is empty, empty string is returned.
 * If the right arguments is not given, the left one is used.
 * @param  {String} left
 * @param  {String} middle
 * @param  {String} right
 * @return {String|Null}
 */
var sandwichWith = function (left, middle, right){
	var m, r;
	if ((typeof middle === "string") || (typeof left === "string")){
		r = right || left;
		m = middle.trim();
		return m ? left + m + r : '';
	}
};
String.prototype.sandwichWith = function (left, right){
	return sandwichWith(left, this, right);
};

/**
 * Glues all elements of the array, replace trailing spaces and repaces multiple spaces with a single one.
 * @param {Array} arr
 * @param {String} glue glue string
 * @return {String}
 */
var concatDropSpaces = function (arr, glue){
	if (glue === undefined){
		glue = ' ';
	}
	return arr.join(glue).replace(/\s+/g, ' ').trim();
};
Array.prototype.concatDropSpaces = function(glue){
	return concatDropSpaces(this, glue);
};


/**
 * Sets width, min-width and max-width of the object.
 * @module 	attributes
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
* @module 	attributes
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
* @module 	attributes
* @param 	{string} str 	string of label-value pairs
* @class  	Style
*/
function Style(str) {
	"use strict";
	if (!(this instanceof Style)) {
		return new Style();
	}

	/**
	 * Fill in the properties with the values from the argument if any
	 */
	if (typeof str === 'string'){
		var attr = str.split(';'),
			len = attr.length,
			i, pair, key, value;
		// parse each attribute/value pair
		for (i = 0; i < len; i++){
			pair = attr[i].split(':');
			// ignore if there is more than one semicolon
			if (pair.length === 2){
				key = pair[0].trim();
				value =  pair[1].trim();
				if(parseFloat(value)){
					value = parseFloat(value);
				}
				this[key] = value;
			}
		}
	}
	/**
	 * Generates string representation of this object (as inline styles)
	 * @method {String} 	toString
	 * @return {String} 	html-like string for this object
	 * @example The return value might be one of this form: style="width: 100px; color: red;"
	 */
	this.toString = function () {
		return toString(this);
	};
	/**
	 * Imposes the width, min-width and max-width
	 * @method {void}	setWidth
	 * @param {mixed} 	w  value of width
	 */
	this.setWidth = function (w) {
		setMinMaxWidth(this, w);
	};
}

/**
 * Styles specific for the table border.
 * @module  attributes
 * @extends Style
 * @class BorderStyle
 */
function BorderStyle(){
	"use strict";
	if (!(this instanceof Style)) {
		return new Style();
	}

	/**
	 * border width in px
	 * @property {String|Number} border-width
	 * @default  1px
	 */
	this['border-width'] = '1px';

	/**
	 * border style. Possible values: none, solid, dotted etc.
	 * @property {String} border-style
	 * @default  'solid'
	 */
	this['border-style'] = 'solid';

	/**
	 * border color. In case one wants black color, one should use a color maximally close to the black (e.g. #000001)
	 * otherwise some web browsers (e.g. GMail) will remove it and substitute it with its own one.
	 * @property {String} border-color
	 * @default  #000001
	 */
	this['border-color'] = '#000001';

}

/**
* This class is supposed to define attributes of html tags
* @module 	attributes
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
* @module 	attributes
* @extends Attributes
* @class  TableAttributes
*/
function TableAttributes(){
	"use strict";
	if (!(this instanceof TableAttributes)) {return new TableAttributes(); }
	/**
	 * Cellpadding attribute of the table. It is supposed that measurement unit is "px".
	 * @property 	{Number} 	cellpadding
	 * @default  	0
	 */
	this.cellpadding = 0;
	/**
	 * Cellspacing attribute of the table. It is supposed that measurement unit is "px".
	 * @property {Number} cellspacing
	 * @default  0
	 */
	this.cellspacing = 0;
}
TableAttributes.prototype = new Attributes();

/**
 * Text specific style class.
 * @module 	attributes
 * @extends Style
 * @class  TextStyle
 */
function TextStyle() {
	"use strict";
	if (!(this instanceof TextStyle)) {
		return new TextStyle();
	}
	/**
	 * Font size, including unit of measurement.
	 * @property {String} font-size
	 * @default  "12px"
	 */
	this["font-size"] = "12px";
	/**
	 * Font color
	 * @property {String}	color 	Font color
	 * @default "#000001". NB: Gmail removes color tags corresponding to the black color, so use #000001 instead of #000000.
	 */
	this.color = "#000001";
	/**
	 * Font weight. Some possible values: "normal", "bold", "bolder", 100, 200, ..., 900. See html manuals for more info.
	 * @property {String|Integer} font-weight
	 * @default "normal"
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
 * @module 	attributes
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
	 * Padding.
	 * @property {String|Number} padding
	 * @default  0
	 */
	this.padding = 0;
	/**
	 * Margin.
	 * @property {String|Number} margin
	 * @default  0
	 */
	this.margin = 0;
}
LinkStyle.prototype = new Style();

/**
 * Represents table style.
 * @module 	attributes
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
	 * @default  "#FFFFFF"
	 */
	// this["border-color"] = "#FFFFFF";
	/**
	 * Style of the border table. See html manuals for possible values.
	 * @property {String} border-style
	 * @default  "none"
	 */
	this["border-style"] = "none";
	/**
	 * Width of the border table.
	 * @property {String|Number} border-width
	 * @default  0
	 */
	// this["border-width"] = 0;
	/**
	 * Margin of the table.
	 * @property {String|Number} margin
	 * @default  0
	 */
	this.margin 	= 0;
	/**
	 * Padding of the table.
	 * @property {String|Number} padding
	 * @default  0
	 */
	this.padding 	= 0;
	/**
	 * Table width.
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
	/**
	 * Border spacing.
	 * @property {String} border-spacing
	 * @default '0px 0px'
	 */
	this['border-spacing'] = '0px 0px';
}
TableStyle.prototype = new Style();

/**
 * Represents table row style.
 * @module 	attributes
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
	 * @default  "#FFFFFF"
	 */
	// this["border-color"] = "#FFFFFF"; //white color
	/**
	 * Style of the border table. See html manuals for possible values.
	 * @property {String} border-style
	 * @default  "none"
	 */
	this["border-style"] = "none";
	/**
	 * Width of the border table.
	 * @property {String|Number} border-width
	 * @default  0
	 */
	// this["border-width"] = 0;
	 /**
	  * Margin of the table.
	  * @property {String|Number} margin
	  * @default  0
	  */
	 this.margin 	= 0;
	 /**
	  * Padding of the table.
	  * @property {String|Number} padding
	  * @default  0
	  */
	 this.padding 	= 0;
	 /**
	  * Table width.
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
 * @module 	attributes
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
	 * @default  "#FFFFFF"
	 */
	// this["border-color"] = "#FFFFFF";
	/**
	 * Style of the border table. See html manuals for possible values.
	 * @property {String} border-style
	 * @default  "none"
	 */
	this["border-style"] = "none";
	/**
	 * Width of the border table.
	 * @property {String|Number} border-width
	 * @default  "0px"
	 */
	// this["border-width"] = "0px";
	/**
	 * Padding.
	 * @property {String|Number} padding
	 * @default  0
	 */
	this.padding = 0;
	/**
	 * Margin.
	 * @property {String|Number} margin
	 * @default  0
	 */
	this.margin = 0;
	/**
	 * Table width.
	 * @property {String|Number} width
	 * @default  0
	 */
	this.width = 0;
	/**
	 * Table minimal width. It is supposed to be equal to "width" property.
	 * @property {String|Number} max-width
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
	/**
	 * Font color
	 * @property {String} color
	 * @default "#000001". NB: Gmail removes color tags corresponding to the black color, so use #000001 instead of #000000.
	 */
	this.color = '#000001';
}
TableCellStyle.prototype = new Style();

/**
 * Represents image styles.
 * @module 	attributes
 * @class	ImageStyle
 * @extends	Style
 */
function ImageStyle() {
	"use strict";
	if (!(this instanceof ImageStyle)) {
		return new ImageStyle();
	}
	/**
	 * Width of the border around the image.
	 * @property {String|Number} border-width
	 * @default  0
	 */
	// this["border-width"] = 0;
	/**
	 * Style of the border around the image. See html manuals for possible values.
	 * @property {String} border-style
	 * @default  "none"
	 */
	this["border-style"] = "none";
	/**
	 * Color of the border around the image.
	 * @property {String} border-color
	 * @default  "#FFFFFF"
	 */
	// this["border-color"] = "#FFFFFF";
	/**
	 * Padding.
	 * @property {String|Number} padding
	 * @default  0
	 */
	this.padding = 0;
	/**
	 * Margin.
	 * @property {String|Number} margin
	 * @default  0
	 */
	this.margin = 0;
	/**
	 * Image width.
	 * @property {String|Number} width
	 * @default  0
	 */
	this.width = 0;
	/**
	 * Image height.
	 * @property {String|Number} height
	 * @default  0
	 */
	this.height = 0;
}
ImageStyle.prototype = new Style();

/**
 * Represents image styles.
 * @module 	attributes
 * @class	ListStyle
 * @extends	Style
 */
function ListStyle() {
	"use strict";
	if (!(this instanceof ListStyle)) {
		return new ListStyle();
	}
	/**
	 * Padding.
	 * @property {String|Number} padding
	 * @default  0
	 */
	this.padding = 0;
	/**
	 * Margin.
	 * @property {String|Number} margin
	 * @default  0
	 */
	this.margin = 0;
}
ListStyle.prototype.toString = new Style();

/**
 * Represents list item styles.
 * @module 	attributes
 * @class	ListItemStyle
 * @extends	Style
 */
function ListItemStyle() {
	"use strict";
	if (!(this instanceof ListItemStyle)) {
		return new ListItemStyle();
	}
	/**
	 * Font size of the  text in the list.
	 * @property {String|Number} font-size
	 * @default 12
	 */
	this["font-size"] = 12;
	/**
	 * Text color of the list item content.
	 * @property {String} color
	 * @type {String}
	 * @default "#000001". NB: Gmail removes color tags corresponding to the black color, so use #000001 instead of #000000.
	 */
	this.color = "#000001";

	/**
	 * Font weight. Some possible values: "normal", "bold", "bolder", 100, 200, ..., 900. See html manuals for more info.
	 * @property {String|Integer} font-weight
	 * @default "normal"
	 */
	this["font-weight"] = 'normal';
	/**
	 * Padding.
	 * @property {String|Number} padding
	 * @default  0
	 */
	this.padding = 0;
	/**
	 * Margin.
	 * @property {String|Number} margin
	 * @default  0
	 */
	this.margin = 0;
}
ListItemStyle.prototype.toString = new Style();


/**
 * This class is used to encompass other objects.
 * @module 	attributes
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
 * @module 	attributes
 * @param {mixed} arg
 * @class  Cell
 */
function Cell(arg) {
	"use strict";
	if (!(this instanceof Cell)) {
		return new Cell(arg);
	}
	/**
	 * Type of the object. Set to value "Cell" for the objects of this type.
	 * @method {string} getType
	 * @return {string}
	 */
	this.getType = function(){
		return "Cell";
	};
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
	 * Insert the argument into the cell content
	 * @method insert
	 * @param {any} item
	 * @return {void}
	 */
	 this.insert = function(item){
	 	this.content.elements.push(item);
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
	 * @pmethod {string} getType
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
	* @method setAtr
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
	 * Append a cell to the row cells. If one tries to append a non-Cell object, an exception is thrown.
	 * @method appendCell
	 * @param {Object} cell  a cell to be appended.
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
			console.log(doc, node);
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
	 * Generates table-specific html code with corresponding attributes and styles.
	 * Creation of the row-related html of each row is delegated to Row::toHtml()
	 * @method toHtml
	 * @return {String} html representation of the row
	 */
	this.toHtml = function () {
		var i, tableAttr, tableStyle, htmlTable, rowsNumber,
			tag = 'table';
		tableAttr = this.attr.toString();
		tableStyle = this.style.toString().sandwichWith('style="', '"');
		htmlTable = [tag, tableAttr, tableStyle].concatDropSpaces().sandwichWith('<', '>');
		rowsNumber = this.rows.length;
		for (i = 0; i < rowsNumber; i++) {
			htmlTable += this.rows[i].toHtml();
		}
		htmlTable += '</' + tag + '>';
		return htmlTable;
	};

	/**
	 * Populates the attributes from a string that is an html repersentation of some table.
	 * It takes a string that is an html representation of a table and update current object
	 * parameters such that it will correspond to the html representation.
	 * In other words, (new Table()).loadFromHtml(htmlString).toHtml() should be similar to htmlString
	 * (eventually up to presence/absence of some parameters and attributes).
	 *
	 * @method loadFromHtml
	 * @param {String} htmlStr
	 * @return {void}
	 */
	this.loadFromHtml = function (htmlStr){
		var parser = new DOMParser(),
			doc = parser.parseFromString(htmlStr, "text/html"),
			node = doc.getElementsByTagName('table')[0],
			attrs = node.attributes,
			nodeStyle = node.getAttribute('style'),
			attrObj = {},
			len = attrs.length,
			i, attr;
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
 * Represents a table with bordered rows.
 * @module   attributes
 * @extends  Table
 * @class    Grating
 */
function Grating(){
	"use strict";
	if (!(this instanceof Grating)) {
		return new Grating();
	}

	/**
	 * Style of the row containing a single cell.
	 * @property {Style} nestedRowStyle
	 */
	this.nestedRowStyle = new Style();

	/**
	 * Style of the  the cell which fills the whole row.
	 * @property {Style} nestedCellStyle
	 */
	this.nestedCellStyle = new Style();

	/**
	 * Style of the  the table that will be inserted into the single cell. This table is supposed to be framed.
	 * @property {Style} nestedTableStyle
	 */
	this.nestedTableStyle = new Style();

	/**
	 * Generates table-specific html code with corresponding attributes and styles.
	 * Creation of the row-related html of each row is delegated to Row::toHtml()
	 * @method toHtml
	 * @return {String} html representation of the row
	 */
	this.toHtml = function () {
		var i, tableAttr, tableStyle, htmlTable, rowsNumber,
			// string representation of the border style
			nestedRowStyle =   this.nestedRowStyle.toString().sandwichWith('style="', '"'),
			nestedCellStyle =  this.nestedCellStyle.toString().sandwichWith('style="', '"'),
			nestedTableStyle = this.nestedTableStyle.toString().sandwichWith('style="', '"'),
			tag = 'table';
		tableAttr = this.attr.toString();
		tableStyle = this.style.toString().sandwichWith('style="','"');

		htmlTable = [tag, tableAttr, tableStyle].concatDropSpaces().sandwichWith('<', '>');
		rowsNumber = this.rows.length;
		for (i = 0; i < rowsNumber; i++) {
			htmlTable += ['tr', nestedRowStyle].concatDropSpaces().sandwichWith('<', '>') +
				['td', nestedCellStyle].concatDropSpaces().sandwichWith('<', '>') +
				[tag, nestedTableStyle].concatDropSpaces().sandwichWith('<', '>');
			htmlTable += this.rows[i].toHtml();
			htmlTable += tag.sandwichWith('</', '>') +'</td></tr>';
		}
		htmlTable += '</' + tag + '>';
		return htmlTable;
	};
}
Grating.prototype = new Table();
