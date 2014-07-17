/*jslint plusplus: true, white: true */
/*global Styles */

/**
 * Represents image styles.
 * @module        Properties
 * @class         ListStyles
 * @constructor
 * @extends       Styles
 */
function ListStyles(obj) {
    'use strict';
    if (!(this instanceof ListStyles)) {
        return new ListStyles(obj);
    }
    Styles.call(this, obj);

    /**
    * Re-set private properties defined in parent class {{#crossLink "Styles"}}Styles{{/crossLink}}:
    * <ol><li>
    * {{#crossLink "Properties/className:property"}}className{{/crossLink}} to be "ListStyles"
    * </li></ol>
    * @method         constructor
    */
    this.setName('ListStyles');



    /**
     * Object with key-values for lists. They should be set if they were not set before. <br/>
     * @property {Object}  listStyleCore
     * @type     {Object}
     * @private
     */
    var listStyleCore = {'padding': 0, 'margin-left': 40, 'margin-right': 0, 'margin-top': 0, 'margin-bottom': 0};
    this.suggestProperty(listStyleCore);
}
ListStyles.prototype = Object.create(Styles.prototype);