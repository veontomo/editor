/*jslint plusplus: true, white: true */
/*global Properties */
/**
 * Represents image properties.
 * @module             Properties
 * @class              LinkProperties
 * @constructor
 * @extends            Properties
 * @since              0.0.5
 */
function LinkProperties(obj) {
    'use strict';
    if (!(this instanceof LinkProperties)) {
        return new LinkProperties(obj);
    }
    Properties.call(this, obj);

    /**
     * Re-set private properties defined in parent class {{#crossLink "Properties"}}Properties{{/crossLink}}:
     * <ol><li>
     * {{#crossLink "Properties/className:property"}}className{{/crossLink}} to be "LinkProperties"
     * </li></ol>
     * @method         constructor
     */
    this.setName('LinkProperties');


    /**
     * Default key-value pairs for link attributes.
     * <pre>{'href': '', 'target': '_blank', 'title': ''}</pre>
     * @property       {Object}             linkCore
     * @private
     * @type           {Object}
     */
    var linkCore = {'href': '', 'target': '_blank', 'title': ''};
    // Sets the above keys in the parent object core
    Object.keys(linkCore).forEach(function(key){
        this.setProperty(key, linkCore[key]);
    }.bind(this));


    /**
     * Object with key-value pairs for link style. To be set, if corresponding key is not set.
     * <pre>{'text-decoration': 'underline', 'font-weight': 'normal', 'padding': 0, 'margin': 0}</pre>
     * @property       {Object}             linkStyleCore
     * @type           {Object}
     * @private
     */
    var linkStyleCore = {'text-decoration': 'underline', 'font-weight': 'normal', 'padding': 0, 'margin': 0};
    this.initializeStyle();
    var stl = this.getStyles();
    stl.suggestProperty(linkStyleCore);
    this.setStyles(stl);

}
LinkProperties.prototype = Object.create(Properties.prototype);