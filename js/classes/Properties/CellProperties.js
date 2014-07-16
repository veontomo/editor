/*jslint plusplus: true, white: true */
/*global Properties */
/**
 * Represents table cell properties.
 * @module      Properties
 * @class       CellProperties
 * @constructor
 * @extends     Properties
 * @since       0.0.5
 */
function CellProperties(obj) {
    'use strict';
    if (!(this instanceof CellProperties)) {
        return new CellProperties(obj);
    }
    Properties.call(this, obj);

    /**
     * Re-set private properties defined in parent class {{#crossLink "Properties"}}Properties{{/crossLink}}:
     * <ol><li>
     * {{#crossLink "Properties/className:property"}}className{{/crossLink}} to be "CellProperties"
     * </li></ol>
     * @method         constructor
     */
    this.setName('CellProperties');

    /**
     * Object with key-value pairs for image style. To be set, if corresponding key is not set.
     * <pre>{'border-style': 'none', 'width': 0, 'max-width': 0, 'min-width': 0, 'padding': 0,
     * 'margin': 0, 'vertical-align': 'top', 'color': '#000001', 'text-align': 'justify'};</pre>
     * @property {Object}  imageStyleCore
     * @type     {Object}
     * @private
     */
    var cellStyleCore = {'border-style': 'none',
        'width': 0, 'max-width': 0, 'min-width': 0,
        'padding': 0, 'margin': 0, 'vertical-align': 'top',
        'color': '#000001', 'text-align': 'justify'};
    this.initializeStyle();
    var stl = this.getStyles();
    stl.suggestProperty(cellStyleCore);
    this.setStyles(stl);

}
CellProperties.prototype = Object.create(Properties.prototype);