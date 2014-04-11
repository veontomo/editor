/*jslint plusplus: true, white: true */
/*global Styles */

/**
 * Represents table style.
 * @module   Properties
 * @class    TableStyles
 * @extends  Styles
 */
function TableStyles(obj) {
    'use strict';
    if (!(this instanceof TableStyles)) {
        return new TableStyles();
    }
    Styles.call(this, obj);

    /**
     * The  name of the class.
     * @since    0.0.2
     * @Properties {String} className
     * @type     {String}
     */
    this.className = 'TableStyles';


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
    //  * @Properties {StrFLinking} border-collapse
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
TableStyles.prototype = Object.create(Styles.prototype);
