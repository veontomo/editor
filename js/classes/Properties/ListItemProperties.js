/*jslint plusplus: true, white: true */
/*global Properties */
/**
 * Represents list item styles.
 * @module        Properties
 * @class         ListItemProperties
 * @extends       Properties
 * @constructor
 * @since         0.0.5
 */
function ListItemProperties(obj) {
    'use strict';
    if (!(this instanceof ListItemProperties)) {
        return new ListItemProperties(obj);
    }
    Properties.call(this, obj);

    /**
    * Re-set private properties defined in parent class {{#crossLink "Styles"}}Styles{{/crossLink}}:
    * <ol><li>
    * {{#crossLink "Properties/className:property"}}className{{/crossLink}} to be "ListItemProperties"
    * </li></ol>
    * @method         constructor
    */
    this.setName('ListItemProperties');


    /**
     * Object with key-value pairs for styles of list items. To be set, if corresponding key is not set.
     * <pre>{'padding': 0, 'margin': 0, 'font-size': 12, 'font-weight': 'normal', 'color': '#000001'}</pre>
     * @property {Object}  listItemStyleCore
     * @type     {Object}
     * @private
     */
    var listItemStyleCore = {'padding': 0, 'margin': 0, 'font-size': 12, 'font-weight': 'normal', 'color': '#000001'};
    this.initializeStyle();
    var stl = this.getStyles();
    stl.suggestProperty(listItemStyleCore);
    this.setStyles(stl);
}
ListItemProperties.prototype = Object.create(Properties.prototype);