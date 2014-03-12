/*jslint plusplus: true, white: true */
/*global Tag, LinkAttributes, LinkStyle */

/**
* This class is represent an html link tag "a".
 * @module 	HtmlElements
 * @class   Link
 * @extends Tag
*/
function Link(href) {
	"use strict";
	if (!(this instanceof Link)) {
		return new Link(href);
	}
	Tag.call(this);


	/**
	 * Link html tag.
	 * @property {String} name
	 * @type     {String}
	 * @default 'a'
	 */
	this.name = 'a';



	/**
	 * Link attributes.
	 * @property {LinkAttributes}      attr
	 * @type     {LinkAttributes}
	 */
	this.attr = new LinkAttributes();

	// set url if it is given
	if(href && (typeof href === 'string')){
		this.attr.href = encodeURI(href);
	}

	/**
	 * link styles.
	 * @property  {LinkStyle}       style
	 * @type      {LinkStyles}
	 */
	this.style = new LinkStyle();

	/**
	 * Href getter. Calles {{#crossLink "LinkAttributes/getHref:method"}}LinkAttributes::getHref(){{/crossLink}}
	 * @method    getHref
	 * @return    {String}
	 */
	this.getHref =  function(){
		return this.attr.getHref();
	};

	/**
	 * Href setter. Calles method {{#crossLink "LinkAttributes/setHref:method"}}LinkAttributes::setHref(){{/crossLink}}
	 * @method   setHref
	 * @param    {String}         url
	 * @return   {void}
	 */
	this.setHref =  function(url){
		this.attr.setHref(url);
	};
}
Link.prototype = Object.create(Tag.prototype);

