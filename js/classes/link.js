/*jslint plusplus: true, white: true */
/*global Tag, LinkAttributes, LinkStyles */

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
	 * Link attributes.
	 * @property {LinkAttributes}      attr
	 * @type     {LinkAttributes}
	 */
	this.attr = new LinkAttributes();

	// set url if it is given
	if(href && (typeof href === 'string')){
		this.attr.url = encodeURI(href);
	}

	/**
	 * link styles.
	 * @property  {LinkStyle}       style
	 * @type      {LinkStyles}
	 */
	this.style = new LinkStyle();

	/**
	 * Url getter. Calles {{#crossLink "LinkAttributes/getUrl:method"}}LinkAttributes::getUrl(){{/crossLink}}
	 * @method    getUrl
	 * @return    {String}
	 */
	this.getUrl =  function(){
		return this.attr.getUrl();
	}

	/**
	 * Url setter. Calles method {{#crossLink "LinkAttributes/setUrl:method"}}LinkAttributes::setUrl(){{/crossLink}}
	 * @method   setUrl
	 * @param    {String}         url
	 * @return   {void}
	 */
	this.setUrl =  function(url){
		this.attr.setUrl(url);
	}


}
Link.prototype = Object.create(Tag.prototype);

