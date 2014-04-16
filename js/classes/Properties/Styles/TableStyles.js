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

}
TableStyles.prototype = Object.create(Styles.prototype);
