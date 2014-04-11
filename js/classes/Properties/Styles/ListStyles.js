/*jslint plusplus: true, white: true */
/*global Styles */

/**
 * Represents image styles.
 * @module  Properties
 * @class   ListStyles
 * @extends Styles
 */
function ListStyles() {
    'use strict';
    if (!(this instanceof ListStyles)) {
        return new ListStyles();
    }
    Styles.call(this);

    /**
     * The  name of the class.
     * @since    0.0.2
     * @Properties {String} className
     * @type     {String}
     */
    this.className = 'ListStyles';


    /**
     * Object with key-values for lists. They should be set if they were not set before. <br/>
     * @property {Object}  listStyleCore
     * @type     {Object}
     * @private
     */
    var listStyleCore = {'padding': 0, 'margin-left': 40, 'margin-right': 0, 'margin-top': 0, 'margin-bottom': 0};
    this.suggestProperty(listStyleCore);

    // /**
    //  * Padding.
    //  * @Properties {String|Number} padding
    //  * @default  0
    //  */
    // this.padding = 0;

    // /**
    //  * Margin left.
    //  * @Properties {String|Number} margin-left
    //  * @default  0
    //  */
    // this['margin-left'] = 40;

    // *
    //  * Margin-right.
    //  * @Properties {String|Number} margin-right
    //  * @default  0

    // this['margin-right'] = 0;

    // /**
    //  * Margin-top.
    //  * @Properties {String|Number} margin-top
    //  * @default  0
    //  */
    // this['margin-top'] = 0;

    // /**
    //  * Margin-bottom.
    //  * @Properties {String|Number} margin-bottom
    //  * @default  0
    //  */
    // this['margin-bottom'] = 0;

}
ListStyles.prototype = Object.create(Styles.prototype);
