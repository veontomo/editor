/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global toString, toString2, setMinMaxWidth, TableStyle, TableRowStyle, TableCellStyle, TableAttributes, Attributes, Style*/

/**
* This class is supposed to characterize inline styles of html tags.
* @module 	attributes
* @param 	{string|object} style 	string of label-value pairs or object.
* @class  	Style
*/
function Style(style) {
	"use strict";
	if (!(this instanceof Style)) {
		return new Style(style);
	}
	var attr, len, i, pair, key, value;

	/**
	 * Fill in the properties with the values from the argument if any
	 */
	if (typeof style === 'string'){
		attr = style.split(';');
		len = attr.length;

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
	if (typeof style === 'object'){
		for (key in style){
			if (style.hasOwnProperty(key)){
				value = style[key];
				if (typeof value === 'string' || typeof value === 'number'){
					this[key] = value;
				}
			}
		}
	}

	/**
	 * Appends object. If non-object is given, error is thrown.
	 * @method appendStyle
	 * @param {Object} stl style to be appended
	 * @return {void}
	 */
	this.appendStyle = function(stl){
		if (typeof stl !== 'object'){
			throw new Error('Argument of Object type is expected!');
		}
		var styleProp;
		for (styleProp in stl){
			if (stl.hasOwnProperty(styleProp)){
				this[styleProp] = stl[styleProp];
			}
		}
	};

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


	/**
	 * returns object with keys 'width', 'color', 'style' describing the border.
	 * If the Style object has 'border-style' equal to 'none', then in the
	 * return object, the key 'width' is set to 0.
	 * If 'border-style' is not 'none' and 'border-width' is present, then in the
	 * return object, the key 'width' the 'border-width' value.
	 * Otherwise, the 'width' key is not present.
	 * @return {Object}
	 */
	this.getBorder = function(){
		var output = {};
		if (this.hasOwnProperty('border-width')){
			output.width = this['border-width'];
		}
		if (this.hasOwnProperty('border-color')){
			output.color = this['border-color'];
		}

		if (this.hasOwnProperty('border-style')){
			if(this['border-style'] === 'none'){
				output.width = 0;
				if (output.hasOwnProperty('color')){
					delete output.color;
				}
			} else {
				output.style = this['border-style'];
			}

		}
		return output;
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
* @param {string|object} attr  a string or object from which this object properties are to be created.
* @class  Attributes
*/
function Attributes(attr) {
	"use strict";
	if (!(this instanceof Attributes)) {
		return new Attributes(attr);
	}
	var attrs, len, i, pair, key, value;
	/**
	 * Fill in the properties with the values from the argument if any
	 */
	if (typeof attr === 'string'){
		attrs = attr.split(';');
		len = attrs.length;

		// parse each attribute/value pair
		for (i = 0; i < len; i++){
			pair = attrs[i].split(':');
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
	if (typeof attr === 'object'){
		for (key in attr){
			if (attr.hasOwnProperty(key)){
				value = attr[key];
				// console.log('key: value', '(' + (typeof key) + ')', key, '('+ (typeof value) + ')', value );
				if (typeof value === 'string' || typeof value === 'number'){
					this[key] = value;
				}
			}
		}
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

	/**
	 * Appends object. If non-object is given, error is thrown. This is a copy-paste of Styles::appendStyle
	 * @method appendAttribute
	 * @param {Object} stl style to be appended
	 * @return {void}
	 */
	this.appendAttribute = function(stl){
		if (typeof stl !== 'object'){
			throw new Error('Argument of Object type is expected!');
		}
		var attrs2;
		for (attrs2 in stl){
			if (stl.hasOwnProperty(attrs2)){
				this[attrs2] = stl[attrs2];
			}
		}
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
ListStyle.prototype = new Style();

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
ListItemStyle.prototype = new Style();