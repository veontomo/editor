/*jslint plusplus: true, white: true */
/*global Styles */

/**
 * Represents table style.
 * @module        Properties
 * @class         TableStyles
 * @constructor
 * @extends       Styles
 */
function TableStyles(obj) {
    'use strict';
    if (!(this instanceof TableStyles)) {
        return new TableStyles();
    }
    Styles.call(this, obj);

    /**
    * Re-set private properties defined in parent class {{#crossLink "Styles"}}Styles{{/crossLink}}:
    * <ol><li>
    * {{#crossLink "Properties/className:property"}}className{{/crossLink}} to be "TableStyles"
    * </li></ol>
    * @method         constructor
    */
    this.setName('TableStyles');



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
