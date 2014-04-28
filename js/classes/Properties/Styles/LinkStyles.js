/*jslint plusplus: true, white: true */
/*global Styles */

/**
 * Represents hyperlink style.
 * @module        Properties
 * @param         {String|Object}      obj      Style class variable will be instantiated using this input
 * @class         LinkStyles
 * @constructor
 * @extends       Styles
 */
function LinkStyles(obj) {
    'use strict';
    if (!(this instanceof LinkStyles)) {
        return new LinkStyles(obj);
    }
    Styles.call(this, obj);

    /**
    * Re-set private properties defined in parent class {{#crossLink "Styles"}}Styles{{/crossLink}}:
    * <ol><li>
    * {{#crossLink "Properties/className:property"}}className{{/crossLink}} to be "LinkStyles"
    * </li></ol>
    * @method         constructor
    */
    this.setName('LinkStyles');

    /**
     * Object with key-values for hyperlinks. They should be set if they were not set before.
     * @property {Object}  linkStyleCore
     * @type     {Object}
     * @private
     */
    var linkStyleCore = {'text-decoration': 'underline', 'font-size': 14, 'font-weight': 'normal', 'padding': 0, 'margin': 0};
    this.suggestProperty(linkStyleCore);

}
LinkStyles.prototype = Object.create(Styles.prototype);
