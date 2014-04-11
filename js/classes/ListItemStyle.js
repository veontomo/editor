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
     * The  name of the class.
     * @since    0.0.2
     * @Properties {String} className
     * @type     {String}
     */
    this.className = 'ListItemStyle';


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