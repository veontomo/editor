/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Property, toString2 */
/**
* This class defines inline styles of html tags
* @module   Property
* @param    {String|Object}      obj      Style class variable will be instantiated using this input
* @class    Style
* @extends  Property
*/
function Style(obj) {
	'use strict';
	if (!(this instanceof Style)) {
		return new Style(obj);
	}
	Property.call(this, obj);

	/**
	 * Generates string representation of this object (as html inline style).
	 * It takse into consideration only string- and number-valued properties. The rest is ignored.
     * If attribite value is a number, the measurement unit will be appended.
     * @method  toString
     * @param   {String|null}   unit     mesurement unit to be added to the numerical attribute values. By default, it is set to 'px'.
	 * @return  {String}        String   union of substrings; each substring is of this format: 'attribute: value;',
     *                                   between the substrings there is a separator ' '.
     * @example "padding: 0px; margin: 10px; color: #ababab"
	 */
    this.toString = function (unit) {
        var val, attr, styles = [];
        unit = unit || 'px';
        for (attr in this) {
            if (this.hasOwnProperty(attr)) {
                // avoid adding method to the output
                val = this[attr];
                switch (typeof val) {
                case 'string':
                    styles.push(attr + ': ' + val.trim());
                    break;
                case 'number':
                    styles.push(attr + ': ' + String(val) + unit);
                    break;
                }
            }
        }
        return styles.join('; ');
    };

    /**
     * Appends style. Alias for the parent method Property::appendProperty()
     * @method  appendStyle
     * @param   {Object|null}   stl       it will be passed to the parent method
     * @return  {void}
     */
    this.appendStyle = function(stl){
    	this.appendProperty(stl);
    };


    /**
     * Imposes the width, min-width and max-width.
     * @method  setWidth
     * @param   {any}     w    value of width.
     * @return  {void}
     */
    this.setWidth = function (w) {
        this.width = w;
        this['min-width'] = w;
        this['max-width'] = w;
    };

}
Style.prototype = Object.create(Property.prototype);

/**
 * Represents table style.
 * @module   Property
 * @class    TableStyle
 * @extends  Style
 */
function TableStyle() {
    'use strict';
    if (!(this instanceof TableStyle)) {
        return new TableStyle();
    }
    Style.call(this);
    /**
     * Color of the border table
     * @property {String} border-color
     * @default  "#FFFFFF"
     */
    // this['border-color'] = '#FFFFFF';
    /**
     * Style of the border table. See html manuals for possible values.
     * @property {String} border-style
     * @default  "none"
     */
    this['border-style'] = 'none';
    /**
     * Width of the border table.
     * @property {String|Number} border-width
     * @default  0
     */
    // this['border-width'] = 0;
    /**
     * Margin of the table.
     * @property {String|Number} margin
     * @default  0
     */
    this.margin = 0;
    /**
     * Padding of the table.
     * @property {String|Number} padding
     * @default  0
     */
    this.padding = 0;
    /**
     * Table width.
     * @property {String|Number} width
     * @default  0
     */
    this.width = 0;
    /**
     * Table maximal width. It is supposed to be equal to "width" property.
     * @property {String|Number} max-width
     * @default  0
     */
    this['max-width'] = this.width;
    /**
     * Table minimal width. It is supposed to be equal to "width" property.
     * @property {String|Number} min-width
     * @default  0
     */
    this['min-width'] = this.width;

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
TableStyle.prototype = Object.create(Style.prototype);

/**
 * Represents hyperlink style.
 * @module  Property
 * @class  LinkStyle
 * @extends Style
 */
function LinkStyle() {
    'use strict';
    if (!(this instanceof LinkStyle)) {
        return new LinkStyle();
    }
    Style.call(this);
    /**
     * Text decoration attribute
     * @property {String} text-decoration
     * @default  "underline"
     */
    this['text-decoration'] = 'underline';

    /**
     * Font size
     * @property {String|Integer} font size
     * @default 12
     */
    this['font-size'] = 12;
    /**
     * Font color attribute
     * @property {String} font color
     * @default  "blue"
     */
    this.color = 'blue';
    /**
     * Font wieght attribute. See html manuals for possible values.
     * @property {String|Integer} font weight
     * @default  "normal"
     */
    this['font-weight'] = 'normal';
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
LinkStyle.prototype = Object.create(Style.prototype);

/**
 * Represents table row style.
 * @module  Property
 * @class  TableRowStyle
 * @extends Style
 */
function TableRowStyle() {
    'use strict';
    if (!(this instanceof TableRowStyle)) {
        return new TableRowStyle();
    }
    Style.call(this);
    /**
     * Color of the border table
     * @property {String} border-color
     * @default  "#FFFFFF"
     */
    // this['border-color'] = '#FFFFFF'; //white color
    /**
     * Style of the border table. See html manuals for possible values.
     * @property {String} border-style
     * @default  "none"
     */
    this['border-style'] = 'none';
    /**
     * Width of the border table.
     * @property {String|Number} border-width
     * @default  0
     */
    // this['border-width'] = 0;
     /**
      * Margin of the table.
      * @property {String|Number} margin
      * @default  0
      */
     this.margin = 0;
     /**
      * Padding of the table.
      * @property {String|Number} padding
      * @default  0
      */
     this.padding = 0;
     /**
      * Table width.
      * @property {String|Number} width
      * @default  0
      */
     this.width = 0;
     /**
      * Table maximal width. It is supposed to be equal to "width" property.
      * @property {String|Number} max-width
      * @default  0
      */
     this['max-width'] = this.width;
     /**
      * Table minimal width. It is supposed to be equal to "width" property.
      * @property {String|Number} min-width
      * @default  0
      */
     this['min-width'] = this.width;
}
TableRowStyle.prototype = Object.create(Style.prototype);

/**
 * Represents table cell styles.
 * @module  Property
 * @class   TableCellStyle
 * @extends Style
 */
function TableCellStyle() {
    'use strict';
    if (!(this instanceof TableCellStyle)) {
        return new TableCellStyle();
    }
    Style.call(this);
    /**
     * Color of the border table
     * @property {String} border-color
     * @default  "#FFFFFF"
     */
    // this['border-color'] = '#FFFFFF';
    /**
     * Style of the border table. See html manuals for possible values.
     * @property {String} border-style
     * @default  "none"
     */
    this['border-style'] = 'none';
    /**
     * Width of the border table.
     * @property {String|Number} border-width
     * @default  "0px"
     */
    // this['border-width'] = '0px';
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
    this['max-width'] = this.width;
    /**
     * Table minimal width. It is supposed to be equal to "width" property.
     * @property {String|Number} min-width
     * @default  0
     */
    this['min-width'] = this.width;
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
TableCellStyle.prototype = Object.create(Style.prototype);

/**
 * Represents image styles.
 * @module  Property
 * @class   ImageStyle
 * @extends Style
 */
function ImageStyle() {
    'use strict';
    if (!(this instanceof ImageStyle)) {
        return new ImageStyle();
    }
    Style.call(this);
    /**
     * Width of the border around the image.
     * @property {String|Number} border-width
     * @default  0
     */
    // this['border-width'] = 0;
    /**
     * Style of the border around the image. See html manuals for possible values.
     * @property {String} border-style
     * @default  "none"
     */
    this['border-style'] = 'none';
    /**
     * Color of the border around the image.
     * @property {String} border-color
     * @default  "#FFFFFF"
     */
    // this['border-color'] = '#FFFFFF';
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
ImageStyle.prototype = Object.create(Style.prototype);

/**
 * Represents image styles.
 * @module  Property
 * @class   ListStyle
 * @extends Style
 */
function ListStyle() {
    'use strict';
    if (!(this instanceof ListStyle)) {
        return new ListStyle();
    }
    Style.call(this);
    /**
     * Padding.
     * @property {String|Number} padding
     * @default  0
     */
    this.padding = 0;

    /**
     * Margin left.
     * @property {String|Number} margin-left
     * @default  0
     */
    this['margin-left'] = 40;

    /**
     * Margin-right.
     * @property {String|Number} margin-right
     * @default  0
     */
    this['margin-right'] = 0;

    /**
     * Margin-top.
     * @property {String|Number} margin-top
     * @default  0
     */
    this['margin-top'] = 0;

    /**
     * Margin-bottom.
     * @property {String|Number} margin-bottom
     * @default  0
     */
    this['margin-bottom'] = 0;

}
ListStyle.prototype = Object.create(Style.prototype);

/**
 * Represents list item styles.
 * @module  Property
 * @class   ListItemStyle
 * @extends Style
 */
function ListItemStyle() {
    'use strict';
    if (!(this instanceof ListItemStyle)) {
        return new ListItemStyle();
    }
    Style.call(this);
    /**
     * Font size of the  text in the list.
     * @property {String|Number} font-size
     * @default 12
     */
    this['font-size'] = 12;
    /**
     * Text color of the list item content.
     * @property {String} color
     * @type {String}
     * @default "#000001". NB: Gmail removes color tags corresponding to the black color, so use #000001 instead of #000000.
     */
    this.color = '#000001';

    /**
     * Font weight. Some possible values: "normal", "bold", "bolder", 100, 200, ..., 900. See html manuals for more info.
     * @property {String|Integer} font-weight
     * @default "normal"
     */
    this['font-weight'] = 'normal';
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
ListItemStyle.prototype = Object.create(Style.prototype);