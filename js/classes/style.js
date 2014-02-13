/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Property, toString2 */
/**
* This class is supposed to define attributes of html tags
* @module 	attributes
* @param {string|object} attr  a string or object from which this object properties are to be created.
* @class  Attributes
*/
function Style(obj) {
	"use strict";
	if (!(this instanceof Style)) {
		return new Style(obj);
	}
	Property.call(this, obj);

	/**
	 * Generates string representation of this object (as html inline style).
	 * It takse into consideration only strings and numbers. The rest is ignored.
	 * If attribite value is a number, the measurement unit will be appended.
	 * @param   {Object}    obj
	 * @return  {String}    String      a union of substrings; each substring is of this format: 'attribute="value"', between the substrings there is a separator ' '.
	 */
	this.toString = function () {
        var val, valType, attr, output = [];
        for (attr in this) {
            if (this.hasOwnProperty(attr)) {
                val = this[attr];
                valType = typeof val;
                // avoid adding method to the output
                if (valType === 'string' || valType === 'number'){
                    output.push(attr + '="' + String(val) + '"');
                }
            }
        }
        return output.join(' ');
    };

    /**
     * Appends style. Alias for the parent method Property::appendProperty()
     * @method  appendStyle
     * @param   {Object|null}   stl       it will be passed to the parent method
     * @return  {void}
     */
    this.appendStyle = function(stl){
    	this.appendProperty(stl);
    }


}
Style.prototype = Object.create(Property.prototype);

