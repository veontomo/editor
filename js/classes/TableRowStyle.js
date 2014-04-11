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
     * The  name of the class.
     * @since    0.0.2
     * @Properties {String} className
     * @type     {String}
     */
    this.className = 'TableRowStyle';


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
