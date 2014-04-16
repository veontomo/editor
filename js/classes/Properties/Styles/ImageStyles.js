/*jslint plusplus: true, white: true */
/*global Styles */
/**
 * Represents image styles.
 * @module  Properties
 * @class   ImageStyle
 * @extends Style
 */
function ImageStyles(obj) {
    'use strict';
    if (!(this instanceof ImageStyles)) {
        return new ImageStyles(obj);
    }
    Styles.call(this, obj);

    /**
     * The  name of the class.
     * @since    0.0.2
     * @Properties {String} className
     * @type     {String}
     */
    this.className = 'ImageStyles';


    /**
     * Object with key-values for images. They should be set if they were not set before. <br/>
     * @property {Object}  imageStyleCore
     * @type     {Object}
     * @private
     */
    var imageStyleCore = {'border-style': 'none', 'width': 0, 'padding': 0, 'margin': 0, 'height': 0};
    this.suggestProperty(imageStyleCore);

}
ImageStyles.prototype = Object.create(Styles.prototype);