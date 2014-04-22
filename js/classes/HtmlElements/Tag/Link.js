/*jslint plusplus: true, white: true */
/*global Tag, LinkAttributes, LinkStyles, Content */

/**
* This class is represent an html link tag "a".
 * @module        HtmlElements
 * @class         Link
 * @constructor
 * @extends       Tag
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
	 * Propagates the target link properties on the argument.
	 * <ol><li>
	 * If the argument is an instance of a Link class, then it is returned a Link instance whose properties
	 * are overridden by the target ones.
	 * </li><li>
	 *  If the argument is an instance of {{#crossLink "Tag"}}Tag{{/crossLink}} and its
	 *  {{#crossLink "Tag/content:property"}}content{{/crossLink}}
	 * <ol><li>
	 * is empty, then it is returned a Link instance with the argument being inserted into the target content
	 * </li><li>
	 * is not empty, then a clone of the target is returned in which the current method is applied to the whole
	 * {{#crossLink "Tag/content:property"}}content{{/crossLink}}.
	 * </li></ol>
	 * </li><li>
	 * If the argument is {{#crossLink "Content"}}Content{{/crossLink}}, then it is returned the argument clone with
	 * the current method being applied to each {{#crossLink "Content"}}Content{{/crossLink}} item.
	 * </li><li>
	 * If none of the above holds, then it is returned a Link instance with argument being inserted into the content.
	 *  </li></ol>
	 * @method    shower
	 * @param     {Tag|Link|Content}         obj
	 * @return    {Tag|Link|Content}
	 */
	this.shower = function(obj){
		var clone = (obj !== undefined && typeof obj.clone === 'function') ? obj.clone() : obj,
			linkClone;
		// case 1: the argument is a Link:
		if (obj instanceof Link){
			clone.attr.appendProperty(this.attr.getCore());
			clone.style.appendProperty(this.style.getCore());
			clone.setHref(this.getHref());
			return clone;
		}
		// case 2: the argument is a Content: call current method on each item
		if (obj instanceof Content){
			var content = new Content(),
				len = clone.length(),
				i, current;
			for (i = 0; i < len; i++){
				current = clone.getElem(i);
				content.appendElem(this.shower(current));
			}
			return content;
		}
		// case 3: the argument is a Tag with non-empty content
		if (obj instanceof Tag && !(obj.content.isEmpty())){
			var contentShowred = this.shower(obj.content);
			clone.content = contentShowred;
			return clone;
		}
		// case 4: all the rest should be processed in the same way:
		// a) make a clone of the target,
		// b) insert the clone of the argument into the content property
		linkClone = this.clone();
		linkClone.content.elements = [clone];
		return linkClone;

	};

}
Link.prototype = Object.create(Tag.prototype);

