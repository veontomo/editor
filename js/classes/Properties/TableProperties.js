/*jslint plusplus: true, white: true */
/*global Properties */
/**
 * Represents image properties.
 * @module      Properties
 * @class       TableProperties
 * @constructor
 * @extends     Properties
 * @since       0.0.5
 */
function TableProperties(obj) {
    'use strict';
    if (!(this instanceof TableProperties)) {
        return new TableProperties(obj);
    }
    Properties.call(this, obj);

    /**
     * Re-set private properties defined in parent class {{#crossLink "Properties"}}Properties{{/crossLink}}:
     * <ol><li>
     * {{#crossLink "Properties/className:property"}}className{{/crossLink}} to be "TableProperties"
     * </li></ol>
     * @method         constructor
     */
    this.setName('TableProperties');


    /**
     * Default key-value pairs for image attributes.
     * <pre>{'cellpadding': 0, 'cellspacing': 0}</pre>
     * @property       {Object}             tableCore
     * @private
     * @type           {Object}
     */
    var tableCore = {'cellpadding': 0, 'cellspacing': 0};
    // Sets the above keys in the parent object core
    Object.keys(tableCore).forEach(function(key){
        this.setProperty(key, tableCore[key]);
    }.bind(this));


    /**
     * Object with key-value pairs for image style. To be set, if corresponding key is not set.
     * <pre>{'border-style': 'none', 'padding': 0, 'margin': 0, 'width': 0, 'max-width': 0,  'min-width': 0,
     * 'border-spacing': '0px 0px', 'font-size': 13, 'text-align': 'justify', 'font-family': 'Arial, sans-serif'}</pre>
     * @property {Object}  tableStyleCore
     * @type     {Object}
     * @private
     */
    var tableStyleCore = {'border-style': 'none', 'padding': 0, 'margin': 0, 'width': 0, 'border-spacing': '0px 0px', 'font-size': 13, 'text-align': 'justify', 'font-family': 'Arial, sans-serif'};
    this.initializeStyle();
    var stl = this.getStyles();
    stl.suggestProperty(tableStyleCore);
    this.setStyles(stl);

}
TableProperties.prototype = Object.create(Properties.prototype);