/*jslint plusplus: true, white: true */
/*global Styles */
/**
 * Represents table row style.
 * @module        Properties
 * @class         TableRowStyles
 * @constructor
 * @extends       Styles
 */
function TableRowStyles(obj) {
    'use strict';
    if (!(this instanceof TableRowStyles)) {
        return new TableRowStyles(obj);
    }
    Styles.call(this, obj);

    /**
     * The  name of the class.
     * @since    0.0.2
     * @property {String} className
     * @type     {String}
     */
    this.className = 'TableRowStyles';


    /**
     * Object with key-values for table rows. They should be set if they were not set before.
     * @property {Object}  tableRowStyleCore
     * @type     {Object}
     * @private
     */
    var tableRowStyleCore = {'border-style': 'none', 'width': 0, 'max-width': 0, 'min-width': 0, 'padding': 0, 'margin': 0};
    this.suggestProperty(tableRowStyleCore);

}
TableRowStyles.prototype = Object.create(Styles.prototype);
