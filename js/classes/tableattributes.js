/*jslint plusplus: true, white: true */
/*global Attributes */
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
