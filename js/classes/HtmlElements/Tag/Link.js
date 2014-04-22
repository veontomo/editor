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
	 * Link html tag.
	 * @property {String} tag
	 * @type     {String}
	 * @default 'a'
	 */
	this.tag = 'a';

	/**
	 * Returns the class name.  This property is introduced for compatibility with IE: i.e.
	 * in FF, `this.constructor` has `name` property that returns "Link", while in IE, there
	 * is no `name` property.
	 * @property {String}    className
	 * @type     {String}
	 * @default  "Link"
	 * @since    0.0.2
	 */
	this.className = "Link";


	/**
	 * Link attributes.
	 * @property {LinkAttributes}      attr
	 * @type     {LinkAttributes}
	 */
	this.attr = new LinkAttributes();

	// set url if it is given
	if(href && (typeof href === 'string')){
		this.attr.setHref(encodeURI(href));
	}

	/**
	 * Styles for Link instance.
	 * @property  {LinkStyle}       style
	 * @type      {LinkStyles}
	 */
	this.style = new LinkStyles();

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

	/**
	 * Sets `text-attribute` of the {{#crossLink "Link/style:property"}}`style`{{/crossLink}} property.
	 * If the argument is missing or equal to `true`, "underline" is imposed.
	 * If the argument is false, then "none" is imposed.
	 * If the argument is a string,  `text-property` will be assigned to be equal to that string.
	 * If nothing of the above holds, `text-property` remains unchanged.
	 * @method    underline
	 * @param     {String|Null|Boolean}  val
	 * @return    {void}
	 */
	this.underline = function(val){
		if (val === true || val === undefined){
			this.style['text-decoration'] = 'underline';
		} else if (val === false) {
			this.style['text-decoration'] = 'none';
		} else if (typeof val === 'string'){
			this.style['text-decoration'] = val;
		}
	};

	/**
	 * Sets `text-attribute` of the {{#crossLink "Link/style:property"}}`style`{{/crossLink}} property to be `none`.
	 * @method    dropUnderline
	 * @return    {void}
	 */
	this.dropUnderline = function(){
		this.style.setProperty('text-decoration', 'none');
	};

	/**
	 * Transforms the target link into a link described by the argument. If the argument is not a
	 * Link instance, a clone of the target link is returned. Otherwise, a clone of the argument is
	 * made in which {{#crossLink "Tag/content:property"}}content{{/crossLink}} is replaced by clone
	 * of {{#crossLink "Tag/content:property"}}content{{/crossLink}} property of the target.
	 * @method  toLink
	 * @param   {Link}     link
	 * @return  {Link}
	 */
	this.toLink = function(link){
		// console.log('I am asked to transform ', this, ' into link ', link);
		if (link instanceof Link){
			var clone = link.clone();
			// console.log('Link::toLink: ', clone);
			clone.content = this.content.clone();
			return clone;
		} else {
			return this.clone();
		}
	}

	/**
	 * Imposes the target link properties on the argument. If the argument is an instance of a Link class,
	 * then its properties are changed according to the target ones. If the argument is an instance of
	 * {{#crossLink "Tag"}}Tag{{/crossLink}} and its {{#crossLink "Tag/content:property"}}content{{/crossLink}}
	 * <ol><li>
	 * is empty, then the argument is inserted into the target content
	 * </li><li>
	 * is not empty, then this method is applied to each element of the content.
	 * </li></ol>
	 * If the argument is {{#crossLink "Content"}}Content{{/crossLink}}, then this method is applied
	 * to each its element.
	 * Otherwise, the argument is inserted into the target content.
	 * @method    cascadeOn
	 * @param     {Tag|Link|Content}         obj
	 * @return    {Tag|Link|Content}
	 */
	this.cascadeOn = function(obj){

	}

}
Link.prototype = Object.create(Tag.prototype);

