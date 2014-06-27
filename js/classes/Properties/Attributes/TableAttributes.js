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
	 * Re-set private properties defined in parent class {{#crossLink "Properties"}}Properties{{/crossLink}}:
	 * <ol><li>
	 * {{#crossLink "Properties/className:property"}}className{{/crossLink}} to be "TableAttributes"
	 * </li></ol>
	 * @method         constructor
	 */
	this.setName('TableAttributes');


	/**
	 * Object with key-values for table attributes. They should be set if they were not set before.
	 * @property 	{String} 	tableAttrCore
	 * @private
	 */
	var tableAttrCore = {cellpadding: 0, cellspacing: 0};
	this.suggestProperty(tableAttrCore);

}
TableAttributes.prototype = Object.create(Attributes.prototype);
