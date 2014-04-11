/**
 * Represents image styles.
 * @module  Properties
 * @class   ImageStyle
 * @extends Style
 */
function ImageStyle() {
    'use strict';
    if (!(this instanceof ImageStyle)) {
        return new ImageStyle();
    }
    Style.call(this);

    /**
     * The  name of the class.
     * @since    0.0.2
     * @Properties {String} className
     * @type     {String}
     */
    this.className = 'ImageStyle';


    /**
     * Object with key-values for images. They should be set if they were not set before. <br/>
     * @property {Object}  imageStyleCore
     * @type     {Object}
     * @private
     */
    var imageStyleCore = {'border-style': 'none', 'width': 0, 'padding': 0, 'margin': 0, 'height': 0};
    this.suggestProperty(imageStyleCore);

    // /**
    //  * Width of the border around the image.
    //  * @Properties {String|Number} border-width
    //  * @default  0
    //  */
    // // this['border-width'] = 0;
    // /**
    //  * Style of the border around the image. See html manuals for possible values.
    //  * @Properties {String} border-style
    //  * @default  "none"
    //  */
    // this['border-style'] = 'none';
    // /**
    //  * Color of the border around the image.
    //  * @Properties {String} border-color
    //  * @default  "#FFFFFF"
    //  */
    // // this['border-color'] = '#FFFFFF';
    // /**
    //  * Padding.
    //  * @Properties {String|Number} padding
    //  * @default  0
    //  */
    // this.padding = 0;
    // /**
    //  * Margin.
    //  * @Properties {String|Number} margin
    //  * @default  0
    //  */
    // this.margin = 0;
    // /**
    //  * Image width.
    //  * @Properties {String|Number} width
    //  * @default  0
    //  */
    // this.width = 0;
    // /**
    //  * Image height.
    //  * @Properties {String|Number} height
    //  * @default  0
    //  */
    // this.height = 0;
}
ImageStyle.prototype = Object.create(Style.prototype);