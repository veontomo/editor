/*jslint plusplus: true, white: true */
/*global Properties */
/**
 * Represents image properties.
 * @module      Properties
 * @class       ImageProperties
 * @constructor
 * @extends     Properties
 * @since       0.0.5
 */
function ImageProperties(obj) {
    'use strict';
    if (!(this instanceof ImageProperties)) {
        return new ImageProperties(obj);
    }
    Properties.call(this, obj);

    /**
     * Re-set private properties defined in parent class {{#crossLink "Properties"}}Properties{{/crossLink}}:
     * <ol><li>
     * {{#crossLink "Properties/className:property"}}className{{/crossLink}} to be "ImageProperties"
     * </li></ol>
     * @method         constructor
     */
    this.setName('ImageProperties');


    /**
     * Default attributes for this instance.
     * @property       {Object}             imageCore
     * @private
     * @type           {Object}
     */
    var imageCore = {'src': null, 'width': 0, 'height': 0, 'title': ''};
    // Sets the above keys in the parent object core
    Object.keys(imageCore).forEach(function(key){
        this.setProperty(key, imageCore[key]);
    }.bind(this));


    /**
     * Object with key-values for images. They should be set if they were not set before. <br/>
     * @property {Object}  imageStyleCore
     * @type     {Object}
     * @private
     */
    var imageStyleCore = {'border-style': 'none', 'width': 0, 'padding': 0, 'margin': 0, 'height': 0};
    this.initializeStyle();
    var stl = this.getStyles();
    stl.suggestProperty(imageStyleCore);
    this.setStyles(stl);

}
ImageProperties.prototype = Object.create(Properties.prototype);