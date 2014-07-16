/*jslint plusplus: true, white: true */
/*global Properties */
/**
 * Represents image properties.
 * @module             Properties
 * @class              RowProperties
 * @constructor
 * @extends            Properties
 * @since              0.0.5
 */
function RowProperties(obj) {
    'use strict';
    if (!(this instanceof RowProperties)) {
        return new RowProperties(obj);
    }
    Properties.call(this, obj);

    /**
     * Re-set private properties defined in parent class {{#crossLink "Properties"}}Properties{{/crossLink}}:
     * <ol><li>
     * {{#crossLink "Properties/className:property"}}className{{/crossLink}} to be "RowProperties"
     * </li></ol>
     * @method         constructor
     */
    this.setName('RowProperties');


    /**
     * Object with key-value pairs for link style. To be set, if corresponding key is not set.
     * <pre>{'border-style': 'none', 'width': 0, 'max-width': 0, 'min-width': 0, 'padding': 0, 'margin': 0}</pre>
     * @property       {Object}             rowStyleCore
     * @type           {Object}
     * @private
     */
    var rowStyleCore = {'border-style': 'none', 'width': 0, 'max-width': 0, 'min-width': 0, 'padding': 0, 'margin': 0};
    this.initializeStyle();
    var stl = this.getStyles();
    stl.suggestProperty(rowStyleCore);
    this.setStyles(stl);
}

RowProperties.prototype = Object.create(Properties.prototype);