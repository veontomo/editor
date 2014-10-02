/*jslint plusplus: true, white: true */
/*global Tag, LinkProperties, Content */

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
	 * {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}} to be
	 * {{#crossLink "LinkProperties"}}LinkProperties{{/crossLink}}
	 * </li></ol>
	 * @method         constructor
	 */
	this.setTag('a');
	this.setName('Link');
	this.setProperties(new LinkProperties());


	/**
	 * Returns value of "href" key inside {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}}.
	 * @method    getHref
	 * @return    {String}
	 */
	this.getHref =  function(){
		return this.getProperty('href');
	};

	/**
	 * Href setter. Calles parent method  {{#crossLink "Tag/setProperty:method"}}setProperty{{/crossLink}}('href', ...).
	 * @method   setHref
	 * @param    {String}         url
	 * @return   {void}
	 */
	this.setHref =  function(url){
		this.setProperty('href', url);
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
	 * Apply target properties on the argument `obj`. The following cases are distinguished:
	 * <ul><li>
	 * the argument is an instance of {{#crossLink "Link"}}Link{{/crossLink}}. In this case, returns output of
	 * {{#crossLink "Link/updateLink:method"}}updateLink{{/crossLink}} method.
	 * </li><li>
	 * the argument is an instance of {{#crossLink "Content"}}Content{{/crossLink}}. In this case, returns output of
	 * {{#crossLink "Link/applyContent:method"}}applyContent{{/crossLink}} method.
	 * </li><li>
	 * the argument is an instance of {{#crossLink "Tag"}}Tag{{/crossLink}}. In this case, returns output of
	 * {{#crossLink "Link/applyTag:method"}}applyTag{{/crossLink}} method.
	 * </li></ul>
	 * If non of the above holds, result of {{#crossLink "Link/wrap:method"}}wrap{{/crossLink}} method is returned.
	 * @method         apply
	 * @param          {Any}                obj
	 * @return         {Any}                type of output depends on input argument
	 */
	this.apply = function(obj){
		if (obj instanceof Link){
			// console.log(obj, ' is a Link');
			return this.updateLink(obj);
		}
		if (obj instanceof Content){
			// console.log(obj, ' is a Content');
			return this.applyContent(obj);
		}
		if (obj instanceof Tag){
			// console.log(obj, ' is a Tag');
			return this.applyTag(obj);
		}
		// console.log(obj, ' is default');
		return this.wrap(obj);
	};

	/**
	 * Returns a copy of the target in which {{#crossLink "Tag/content:property"}}content{{/crossLink}}
	 * contains the only element which is `obj`.
	 * @method         wrap
	 * @param          {Any}                obj
	 * @return         {Link}
	 */
	this.wrap = function(obj){
		/// strange thing: even though the target is a Link and the output is to be a Link,
		/// if I create object to return by means of this.clone(), somehow Content elements get
		/// overridden when I use them in apply. For this reason, "new Link()" is used to create
		/// the object which will be returned.
		var output = new Link(),
			item = (typeof obj.clone === 'function') ? obj.clone() : obj;
		output.setProperties(this.getProperties().clone());
		output.setStyles(this.getStyles().clone());
		output.setElements([item]);
		return output;

	};

	/**
	 * Converts the argument in link. Argument `tagObj` must be a {{#crossLink "Tag"}}Tag{{/crossLink}} instance.
	 * If its {{#crossLink "Tag/content"}}content{{/crossLink}} is
	 * <ol><li>
	 * non empty, then it is returned a copy of the argument in which {{#crossLink "Tag/content:property"}}content{{/crossLink}}
	 * is replaced by output of {{#crossLink "Link/applyContent:method"}}applyContent{{/crossLink}} method.
	 * </li><li>
	 * empty, then a {{#crossLink "Link"}}Link{{/crossLink}} instance is returned. This instance has
	 * {{#crossLink "Tag/attributes:property"}}attributes{{/crossLink}} and
	 * {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} of the target and its
	 * {{#crossLink "Tag/content:property"}}content{{/crossLink}} contains `tagObj` as the only element.
	 * </li><li>
	 * </li></ol>
	 * @method         applyTag
	 * @param          {Tag}                tagObj
	 * @return         {Tag|Link}
	 */
	this.applyTag = function(tagObj){
		if (tagObj instanceof Tag){
			var result, cntn, cntnLinkified;
			if (!(tagObj.getContent().isEmpty())){
				result = tagObj.clone();
				cntn = result.getContent();
				cntnLinkified = this.applyContent(cntn);
				result.setContent(cntnLinkified);
			} else {
				result = this.wrap(tagObj);
			}
			return result;
		}
	};

	/**
	 * Modifies a Content instance in such a way that {{#crossLink "Link/apply:method"}}apply{{/crossLink}}
	 * is applied on all elements of the argumet.
	 * @method         applyContent
	 * @param          {Content}            cntn
	 * @return         {Content}
	 */
	this.applyContent = function(cntn){
		if (cntn instanceof Content){
			var result = new Content(),
				cntnElems = cntn.getElements(),
				len = cntnElems.length,
				i, current, linked, newLink;
			for (i = 0; i < len; i++){
				current = cntnElems[i];
				newLink = this.clone();
				linked = newLink.apply(current);
				result.appendElem(linked);
			}
			return result;
		}

	};

	/**
	 * Returns a new Link instance with `href` as in the target, {{#crossLink "Tag/content:property"}}content{{/crossLink}}
	 * as in the argument, {{#crossLink "Tag/attributes:property"}}attributes{{/crossLink}} and
	 * {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} are as in the argument but augmented by corresponding values
	 * from the target
	 * @method         updateLink
	 * @param          {Link}               link
	 * @return         {Link}
	 */
	this.updateLink = function(link){
		if (link instanceof Link){
			var result = new Link(),
				src = this.getHref();
			result.setElements(link.getElements());
			result.setProperties(this.getProperties());
			result.setStyles(this.getStyles());
			result.appendStyle(link.getStyles());
			result.appendProperties(link.getProperties());
			result.setHref(src);
			return result;
		}
	};

	/**
	 * Returns `true` if the link's inline style {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}} contain
	 * `text-decoration` key which is set to `underline`. Otherwise, `false` is returned.
	 * @method         isUnderlined
	 * @return         {Boolean}
	 * @since          0.0.6
	 */
	this.isUnderlined = function(){
		return this.getStyleProperty('text-decoration') === 'underline';
	};

}
Link.prototype = Object.create(Tag.prototype);
