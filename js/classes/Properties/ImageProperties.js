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
     * Object with key-values for images. They should be set if they were not set before. <br/>
     * @property {Object}  imageStyleCore
     * @type     {Object}
     * @private
     */
    var imageStyleCore = {'border-style': 'none', 'width': 0, 'padding': 0, 'margin': 0, 'height': 0};
    this.suggestProperty(imageStyleCore);

}
ImageProperties.prototype = Object.create(Properties.prototype);