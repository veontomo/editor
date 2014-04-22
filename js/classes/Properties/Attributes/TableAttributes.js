/*jslint plusplus: true, white: true */
/*global Attributes */
/**
* Table-specific attributes.
* @module 	   Properties
* @extends     Attributes
* @class       TableAttributes
* @constructor
*/
function TableAttributes(attr){
	"use strict";
	if (!(this instanceof TableAttributes)) {
		return new TableAttributes(attr);
	}
	Attributes.call(this, attr);

	/**
	 * Object with key-values for table attributes. They should be set if they were not set before.
	 * @property 	{String} 	tableAttrCore
	 * @private
	 */
	var tableAttrCore = {cellpadding: 0, cellspacing: 0};
	this.suggestProperty(tableAttrCore);

	/**
	 * The  name of the class.
	 * @since    0.0.2
	 * @property {String} className
	 * @type     {String}
	 */
	this.className = 'TableAttributes';

}
TableAttributes.prototype = Object.create(Attributes.prototype);
