/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Properties, toString2 */
/**
* This class defines inline styles of html tags
* @module   Properties
* @param    {String|Object}      obj      Style class variable will be instantiated using this input
* @class    Style
* @extends  Properties
*/
function Style(obj) {
	'use strict';
	if (!(this instanceof Style)) {
		return new Style(obj);
	}
	Properties.call(this, obj);

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
                    if(attr !== 'className'){
                        styles.push(attr + ': ' + val.trim());
                    }
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
     * The  name of the class.
     * @since    0.0.2
     * @Properties {String} className
     * @type     {String}
     */
    this.className = 'Style';

    /**
     * Appends style. Alias for the parent method {{#crossLink "Properties/appendProperty:method"}}Properties::appendProperty(){{/crossLink}}
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
        this.setProperty('width', w);
        this.setProperty('min-width', w);
        this.setProperty('max-width', w);
    };

    /**
     * Returns object {width: ..., color: ..., style: ...} describing border. If the Style has no Properties
     * 'border-style', then 'none' will be used. If the Style has no 'border-width', then zero will be used.
     * If the Style has no Properties 'border-color', then it will not be set.
     * @method  getBorderInfo
     * @return {Object}              object of the form {'width': ..., 'color': ..., 'style': ...}
     */
    this.getBorderInfo = function(){
        var output = {};
        output.width = this.getProperty('border-width') || 0;
        output.style = this.getProperty('border-style') || 'none';
        if (this.hasProperty('border-color')){
            output.color = this.getProperty('border-color');
        }
        return output;

    };

    /**
     * Loads style Properties from the argument that is supposed to be either of type
     * [NamedNodeMap](http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core.html#ID-1780488922)
     * (or, at least, respond to a `getNamedItem()` method) or a string. If not of these types, `false` is returned.
     * In case the argument is a [NamedNodeMap](http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core.html#ID-1780488922)
     * instance, its `style` item is picked up and transformed into a string.
     * @method  load
     * @param  {String|NamedNodeMap}       attr           instance of NamedNodeMap or a
     * @return {Boolean}                                  true, if the properties are loaded, false otherwise
     */
    this.load = function(attr){
        // console.log('Style::load is called with ', attr);
        var seed, seedObj;
        if (attr !== undefined){
            if (typeof attr === 'string'){
                seed = attr;
            } else if (typeof attr.getNamedItem === 'function') {
                seedObj =  attr.getNamedItem('style');
                seed = seedObj ? seedObj.value : '';
            } else {
                return false;
            }
            this.appendStyle(seed);
        }
        return true;
    };

    /**
     * Applies the attributes on the argument. The argument is supposed to be an instance of
     * [DOM.Element](https://developer.mozilla.org/en-US/docs/Web/API/element). In fact,
     * it is used only [setAttribute()](https://developer.mozilla.org/en-US/docs/Web/API/Element.setAttribute)
     * method of that instance.
     * @method  decorateElement
     * @param  {Object}    elem
     * @return {void}
     */
    this.decorateElement = function(el){
        if (typeof el.setAttribute === 'function'){
            var str = this.toString();
            el.setAttribute('style', str);
        }
    };


}
Style.prototype = Object.create(Properties.prototype);

/**
 * Represents table style.
 * @module   Properties
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
     * Object with key-values for tables. They should be set if they were not set before.
     * @property {Object}  tableStyleCore
     * @type     {Object}
     * @private
     */
    var tableStyleCore = {'border-style': 'none', 'padding': 0, 'margin': 0, 'width': 0, 'max-width': 0, 'min-width': 0, 'border-spacing': '0px 0px'};
    this.suggestProperty(tableStyleCore);

    // /**
    //  * Color of the border table
    //  * @Properties {String} border-color
    //  * @default  "#FFFFFF"
    //  */
    // // this['border-color'] = '#FFFFFF';
    // /**
    //  * Style of the border table. See html manuals for possible values.
    //  * @Properties {String} border-style
    //  * @default  "none"
    //  */
    // this[] = 'none';
    // /**
    //  * Width of the border table.
    //  * @Properties {String|Number} border-width
    //  * @default  0
    //  */
    // // this['border-width'] = 0;
    // /**
    //  * Margin of the table.
    //  * @Properties {String|Number} margin
    //  * @default  0
    //  */
    // this.margin = 0;
    // /**
    //  * Padding of the table.
    //  * @Properties {String|Number} padding
    //  * @default  0
    //  */
    // this.padding = 0;
    // *
    //  * Table width.
    //  * @Properties {String|Number} width
    //  * @default  0

    // this.width = 0;
    // /**
    //  * Table maximal width. It is supposed to be equal to "width" Properties.
    //  * @Properties {String|Number} max-width
    //  * @default  0
    //  */
    // this['max-width'] = this.width;
    // /**
    //  * Table minimal width. It is supposed to be equal to "width" Properties.
    //  * @Properties {String|Number} min-width
    //  * @default  0
    //  */
    // this['min-width'] = this.width;

    // /**
    //  * Whether to collapse the table borders or not.
    //  * @deprecated Do not use, because it causes problems in MS Outlook.
    //  * @Properties {String} border-collapse
    //  * @default  0
    //  */
    // // this['border-collapse'] = 'collapse';
    // /**
    //  * Border spacing.
    //  * @Properties {String} border-spacing
    //  * @default '0px 0px'
    //  */
    // this['border-spacing'] = '0px 0px';
}
TableStyle.prototype = Object.create(Style.prototype);

/**
 * Represents hyperlink style.
 * @module  Properties
 * @param    {String|Object}      obj      Style class variable will be instantiated using this input
 * @class  LinkStyle
 * @extends Style
 */
function LinkStyle(obj) {
    'use strict';
    if (!(this instanceof LinkStyle)) {
        return new LinkStyle(obj);
    }
    Style.call(this, obj);

    /**
     * Object with key-values for hyperlinks. They should be set if they were not set before.
     * @property {Object}  linkStyleCore
     * @type     {Object}
     * @private
     */
    var linkStyleCore = {'text-decoration': 'underline', 'font-size': 14, 'font-weight': 'normal', 'padding': 0, 'margin': 0};
    this.suggestProperty(linkStyleCore);

}
LinkStyle.prototype = Object.create(Style.prototype);

/**
 * Represents table row style.
 * @module  Properties
 * @class  TableRowStyle
 * @extends Style
 */
function TableRowStyle(obj) {
    'use strict';
    if (!(this instanceof TableRowStyle)) {
        return new TableRowStyle(obj);
    }
    Style.call(this);

    /**
     * Object with key-values for table rows. They should be set if they were not set before.
     * @property {Object}  tableRowStyleCore
     * @type     {Object}
     * @private
     */
    var tableRowStyleCore = {'border-style': 'none', 'width': 0, 'max-width': 0, 'min-width': 0, 'padding': 0, 'margin': 0};
    this.suggestProperty(tableRowStyleCore);

}
TableRowStyle.prototype = Object.create(Style.prototype);

/**
 * Represents table cell styles.
 * @module  Properties
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
     * Object with key-values for table cells. They should be set if they were not set before. <br/>
     * NB: Gmail removes color tags corresponding to black color, so use `#000001` instead of `#000000`.
     * @property {Object}  tableCellStyleCore
     * @type     {Object}
     * @private
     */
    var tableCellStyleCore = {'border-style': 'none', 'width': 0, 'max-width': 0, 'min-width': 0, 'padding': 0, 'margin': 0, 'vertical-align': 'top', 'color': '#000001'};
    this.suggestProperty(tableCellStyleCore);
}
TableCellStyle.prototype = Object.create(Style.prototype);

/**
 * Represents image styles.
 * @module  Properties
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
     * Object with key-values for images. They should be set if they were not set before. <br/>
     * @property {Object}  imageStyleCore
     * @type     {Object}
     * @private
     */
    var imageStyleCore = {'border-style': 'none', 'width': 0, 'padding': 0, 'margin': 0, 'height': 0};
    this.suggestProperty(imageStyleCore);

    // /**
    //  * Width of the border around the image.
    //  * @Properties {String|Number} border-width
    //  * @default  0
    //  */
    // // this['border-width'] = 0;
    // /**
    //  * Style of the border around the image. See html manuals for possible values.
    //  * @Properties {String} border-style
    //  * @default  "none"
    //  */
    // this['border-style'] = 'none';
    // /**
    //  * Color of the border around the image.
    //  * @Properties {String} border-color
    //  * @default  "#FFFFFF"
    //  */
    // // this['border-color'] = '#FFFFFF';
    // /**
    //  * Padding.
    //  * @Properties {String|Number} padding
    //  * @default  0
    //  */
    // this.padding = 0;
    // /**
    //  * Margin.
    //  * @Properties {String|Number} margin
    //  * @default  0
    //  */
    // this.margin = 0;
    // /**
    //  * Image width.
    //  * @Properties {String|Number} width
    //  * @default  0
    //  */
    // this.width = 0;
    // /**
    //  * Image height.
    //  * @Properties {String|Number} height
    //  * @default  0
    //  */
    // this.height = 0;
}
ImageStyle.prototype = Object.create(Style.prototype);

/**
 * Represents image styles.
 * @module  Properties
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
     * Object with key-values for lists. They should be set if they were not set before. <br/>
     * @property {Object}  listStyleCore
     * @type     {Object}
     * @private
     */
    var listStyleCore = {'padding': 0, 'margin-left': 40, 'margin-right': 0, 'margin-top': 0, 'margin-bottom': 0};
    this.suggestProperty(listStyleCore);

    // /**
    //  * Padding.
    //  * @Properties {String|Number} padding
    //  * @default  0
    //  */
    // this.padding = 0;

    // /**
    //  * Margin left.
    //  * @Properties {String|Number} margin-left
    //  * @default  0
    //  */
    // this['margin-left'] = 40;

    // *
    //  * Margin-right.
    //  * @Properties {String|Number} margin-right
    //  * @default  0

    // this['margin-right'] = 0;

    // /**
    //  * Margin-top.
    //  * @Properties {String|Number} margin-top
    //  * @default  0
    //  */
    // this['margin-top'] = 0;

    // /**
    //  * Margin-bottom.
    //  * @Properties {String|Number} margin-bottom
    //  * @default  0
    //  */
    // this['margin-bottom'] = 0;

}
ListStyle.prototype = Object.create(Style.prototype);

/**
 * Represents list item styles.
 * @module  Properties
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
     * Object with key-values for lists. They should be set if they were not set before. <br/>
     * @property {Object}  listItemStyleCore
     * @type     {Object}
     * @private
     */
    var listItemStyleCore = {'padding': 0, 'margin': 0, 'font-size': 12, 'font-weight': 'normal', 'color': '#000001'};
    this.suggestProperty(listItemStyleCore);

    // /**
    //  * Font size of the  text in the list.
    //  * @Properties {String|Number} font-size
    //  * @default 12
    //  */
    // this['font-size'] = 12;
    // /**
    //  * Text color of the list item content.
    //  * @Properties {String} color
    //  * @type {String}
    //  * @default "#000001". NB: Gmail removes color tags corresponding to the black color, so use #000001 instead of #000000.
    //  */
    // this.color = '#000001';

    // *
    //  * Font weight. Some possible values: "normal", "bold", "bolder", 100, 200, ..., 900. See html manuals for more info.
    //  * @Properties {String|Integer} font-weight
    //  * @default "normal"

    // this['font-weight'] = 'normal';
    // /**
    //  * Padding.
    //  * @Properties {String|Number} padding
    //  * @default  0
    //  */
    // this.padding = 0;
    // /**
    //  * Margin.
    //  * @Properties {String|Number} margin
    //  * @default  0
    //  */
    // this.margin = 0;
}
ListItemStyle.prototype = Object.create(Style.prototype);