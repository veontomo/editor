/*jslint plusplus: true, white: true */
/*global Styles */
/**
 * Represents list item styles.
 * @module        Properties
 * @class         ListItemStyles
 * @extends       Styles
 * @constructor
 */
function ListItemStyles(obj) {
    'use strict';
    if (!(this instanceof ListItemStyles)) {
        return new ListItemStyles(obj);
    }
    Styles.call(this, obj);

    /**
    * Re-set private properties defined in parent class {{#crossLink "Styles"}}Styles{{/crossLink}}:
    * <ol><li>
    * {{#crossLink "Properties/className:property"}}className{{/crossLink}} to be "ListItemStyles"
    * </li></ol>
    * @method         constructor
    */
    this.setName('ListItemStyles');


    /**
     * Object with key-values for lists. They should be set if they were not set before. <br/>
     * @property {Object}  listItemStyleCore
     * @type     {Object}
     * @private
     */
    var listItemStyleCore = {'padding': 0, 'margin': 0, 'font-size': 12, 'font-weight': 'normal', 'color': '#000001'};
    this.suggestProperty(listItemStyleCore);
}
ListItemStyles.prototype = Object.create(Styles.prototype);