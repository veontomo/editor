/*jslint plusplus: true, white: true */
/*global Properties */

/**
 * Represents image styles.
 * @module        Properties
 * @class         ListProperties
 * @constructor
 * @extends       Properties
 */
function ListProperties(obj) {
    'use strict';
    if (!(this instanceof ListProperties)) {
        return new ListProperties(obj);
    }
    Properties.call(this, obj);

    /**
    * Re-set private properties defined in parent class {{#crossLink "Styles"}}Styles{{/crossLink}}:
    * <ol><li>
    * {{#crossLink "Properties/className:property"}}className{{/crossLink}} to be "ListProperties"
    * </li></ol>
    * @method         constructor
    */
    this.setName('ListProperties');

    /**
     * Object with key-value pairs for link style. To be set, if corresponding key is not set.
     * <pre>{'padding': 0, 'margin-left': 40, 'margin-right': 0, 'margin-top': 0, 'margin-bottom': 0}</pre>
     * @property       {Object}             linkStyleCore
     * @type           {Object}
     * @private
     */
    var linkStyleCore = {'padding': 0, 'margin-left': 40, 'margin-right': 0, 'margin-top': 0, 'margin-bottom': 0};
    this.initializeStyle();
    var stl = this.getStyles();
    stl.suggestProperty(linkStyleCore);
    this.setStyles(stl);
}
ListProperties.prototype = Object.create(Properties.prototype);
