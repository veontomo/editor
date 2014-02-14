/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Property, toString2 */
/**
* This class is supposed to define attributes of html tags
* @module 	Property
* @param    {String|Object}    obj       Attributes class variable will be instantiated using this input
* @class    Attributes
* @extends  Property
*/
function Attributes(obj) {
	"use strict";
	if (!(this instanceof Attributes)) {
		return new Attributes(obj);
	}
	Property.call(this, obj);

	/**
	 * Generates string representation of this object (as html attributes).
	 * It takse into consideration only strings and numbers. The rest is ignored.
	 * @method     toString
	 * @return     {String}    a union of substrings; each substring is of this format: 'attribute="value"',
	 *                         between the substrings there is a separator ' ' (space).
	 * @example    class="example" id="tag"
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
}
Attributes.prototype = Object.create(Property.prototype);

/**
* Table-specific attributes.
* @module 	Property
* @extends Attributes
* @class  TableAttributes
*/
function TableAttributes(attr){
	"use strict";
	if (!(this instanceof TableAttributes)) {
		return new TableAttributes(attr);
	}
	Attributes.call(this, attr);
	/**
	 * Cellpadding attribute of the table. It is supposed that measurement unit is "px".
	 * @property 	{Number} 	cellpadding
	 * @default  	0
	 */
	this.cellpadding = 0;
	/**
	 * Cellspacing attribute of the table. It is supposed that measurement unit is "px".
	 * @property {Number} cellspacing
	 * @default  0
	 */
	this.cellspacing = 0;
}
TableAttributes.prototype = Object.create(Attributes.prototype);
