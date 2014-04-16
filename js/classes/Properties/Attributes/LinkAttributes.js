/*jslint plusplus: true, white: true */
/*global Property, Attributes, core */

/**
* Table-specific attributes.
* @module     	Properties
* @extends      Attributes
* @class        LinkAttributes
*/
function LinkAttributes(attr){
	"use strict";
	if (!(this instanceof LinkAttributes)) {
		return new LinkAttributes(attr);
	}
	Attributes.call(this, attr);

	/**
	 * Object with key-values for link attributes. They should be set if they were not set before.
	 * @property 	{String} 	linkAttrCore
	 * @private
	 */
	var linkAttrCore = {href: ''};
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


	/**
	 * The  name of the class.
	 * @since    0.0.2
	 * @property {String} className
	 * @type     {String}
	 */
	this.className = 'LinkAttributes';



}
LinkAttributes.prototype = Object.create(Attributes.prototype);
