/*jslint plusplus: true, white: true */
/*global Property, Attributes, core */

/**
* Table-specific attributes.
* @module     	Properties
* @extends      Attributes
* @class        LinkAttributes
* @constructor
*/
function LinkAttributes(attr){
	"use strict";
	if (!(this instanceof LinkAttributes)) {
		return new LinkAttributes(attr);
	}

	Attributes.call(this, attr);

	/**
	 * Re-set private properties defined in parent class {{#crossLink "Properties"}}Properties{{/crossLink}}:
	 * <ol><li>
	 * {{#crossLink "Properties/className:property"}}className{{/crossLink}} to be "LinkAttributes"
	 * </li></ol>
	 * @method         constructor
	 */
	this.setName('LinkAttributes');

	/**
	 * Object with key-values for link attributes. They should be set if they were not set before.
	 * @property 	{String} 	linkAttrCore
	 * @private
	 */
	var linkAttrCore = {href: '', target: '_blank'};
	this.suggestProperty(linkAttrCore);

	/**
	 * Href getter.
	 * @method  getHref
	 * @return  {String}
	 */
	this.getHref =  function(){
		return this.getProperty('href');
	};

	/**
	 * Href setter. Native javascript function `encodeURI()` will be applied to the argument.
	 * @method  setHref
	 * @param   {String}         url               `encodeURI()` is to be applied when assigning to this.url
	 * @return  {String}
	 */
	this.setHref =  function(url){
		this.setProperty('href', encodeURI(url));
	};


}
LinkAttributes.prototype = Object.create(Attributes.prototype);
