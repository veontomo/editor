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
	 * Re-set private properties defined in parent class {{#crossLink "Tag"}}Tag{{/crossLink}}:
	 * <ol><li>
	 * {{#crossLink "Tag/tag:property"}}tag{{/crossLink}} to be "a"
	 * </li><li>
	 * {{#crossLink "Tag/className:property"}}className{{/crossLink}} to be "Link"
	 * </li><li>
	 * {{#crossLink "Tag/attributes:property"}}attributes{{/crossLink}} to be
	 * {{#crossLink "LinkStyles"}}LinkStyles{{/crossLink}}
	 * </li><li>
	 * {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} to be
	 * {{#crossLink "LinkAttributes"}}LinkAttributes{{/crossLink}}
	 * </li></ol>
	 * @method         constructor
	 */
	this.setTag('a');
	this.setName('Link');
	this.setAttributes(new LinkAttributes());
	this.setStyles(new LinkStyles());


	/**
	 * Returns value of "href" key of the current object attribute. If it turns out to be an instance of
	 * {{#crossLink "LinkAttributes"}}LinkAttributes{{/crossLink}} class, then calls
	 * {{#crossLink "LinkAttributes/getHref:method"}}getHref(){{/crossLink}} method, otherwise
	 * returns "href" key value of {{#crossLink "Link/attributes:property"}}attributes{{/crossLink}}.
	 * @method    getHref
	 * @return    {String}
	 */
	this.getHref =  function(){
		var attrCopy = this.getAttributes();
		return (typeof attrCopy.getHref === 'function') ? attrCopy.getHref() : attrCopy.getProperty('href');
	};

	/**
	 * Href setter. Calles method {{#crossLink "Attributes/setAttrProperty:method"}}setAttrProperty('href', ...){{/crossLink}}.
	 * @method   setHref
	 * @param    {String}         url
	 * @return   {void}
	 */
	this.setHref =  function(url){
		this.setAttrProperty('href', url);
	};


	// set url if it is given
	if(href && (typeof href === 'string')){
		this.setHref(encodeURI(href));
	}


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
			this.setStyleProperty('text-decoration', 'underline');
		} else if (val === false) {
			this.setStyleProperty('text-decoration', 'none');
		} else if (typeof val === 'string'){
			this.setStyleProperty('text-decoration', val);
		}
	};

	/**
	 * Sets `text-attribute` of the {{#crossLink "Link/style:property"}}`style`{{/crossLink}} property to be `none`.
	 * @method    dropUnderline
	 * @return    {void}
	 */
	this.dropUnderline = function(){
		this.setStyleProperty('text-decoration', 'none');
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
		console.log('Link shower method: input = ', obj);
		var clone = (obj !== undefined && typeof obj.clone === 'function') ? obj.clone() : obj,
			linkClone;
		// case 1: the argument is a Link:
		if (obj instanceof Link){
			console.log('input is a link');
			clone.getAttributes().appendProperty(this.getAttributes().getCore());
			clone.getStyles().appendProperty(this.getStyles().getCore());
			clone.setHref(this.getHref());
			console.log('returning clone: ', clone );
			return clone;
		}
		// case 2: the argument is a Content: call current method on each item
		if (obj instanceof Content){
			console.log('input is a Content');
			var content = new Content(),
				len = clone.length(),
				i, current;
			for (i = 0; i < len; i++){
				current = clone.getElem(i);
				content.appendElem(this.shower(current));
			}
			console.log('returning content: ', content );
			return content;
		}
		// case 3: the argument is a Tag with non-empty content
		if (obj instanceof Tag && !(obj.getContent().isEmpty())){
			console.log('input is a Tag with non-empty content');
			var contentShowred = this.shower(obj.getContent());
			clone.setContent(contentShowred);
			console.log('returning clone: ', clone );
			return clone;
		}
		// case 4: all the rest should be processed in the same way:
		// a) make a clone of the target,
		// b) insert the clone of the argument into the content property
		console.log('input is a general one');
		linkClone = this.clone();
		linkClone.setContent(clone);
		console.log('returning linkClone: ', linkClone );
		return linkClone;

	};

}
Link.prototype = Object.create(Tag.prototype);
