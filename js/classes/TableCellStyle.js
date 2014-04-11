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
     * The  name of the class.
     * @since    0.0.2
     * @Properties {String} className
     * @type     {String}
     */
    this.className = 'TableCellStyle';


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
