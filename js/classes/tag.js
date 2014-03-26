/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global DOMParser, Node, ListStyle, Attributes, Content, ListItemStyle, Helper, Style, Link, window*/

/**
 * This class is used to represent a general html tag.
 * @module 	    HtmlElements
 * @class  		Tag
 * @since       0.0.2
 * @author      A.Shcherbakov
 *
 */
function Tag() {
	"use strict";
	if (!(this instanceof Tag)) {
		return new Tag();
	}

	/**
	 * Tag name.To be set explicitely in child classes.
	 * @property {String}          name
	 * @default  null
	 * @since 0.0.1
	 */
	this.name = null;

	/**
	 * Returns the class name.  This property is introduced for compatibility with IE: i.e.
	 * in FF, this.constructor.name returns "Tag", while IE, it returns "undefined".
	 * This property must be overridden in all inherited classes.
	 * @property {String}    className
	 * @type     {String}
	 * @since    0.0.2
	 */
	this.className = "Tag";

	/**
	 * Returns value of the name attribute.
	 * @method  getName
	 * @return  {string}
	 * @since 0.0.1
	 */
	this.getName = function(){
		return this.name;
	};


	/**
	 * Tag attributes
	 * @property {Attributes}          attr
	 * @type     {Attributes}
	 * @default  Attributes()
	 * @since 0.0.1
	 */
	this.attr = new Attributes();

	/**
	* Attribute setter.
	* @method setAttr
	* @param {String|Object} attr
	* @return {void}
	* @since 0.0.1
	*/
	this.setAttr = function(attr){
		this.attr = attr;
	};

	/**
	 * Appends style to the cell. Alias for Style::appendStyle().
	 * @method appendStyle
	 * @param  {Style|Obj}   stl   style to be appended
	 * @return {void}
	 * @since 0.0.1
	 */
	this.appendStyle = function(stl){
		this.style.appendStyle(stl);
		return null;
	};

	/**
	 * Appends style to the element at position pos. It is supposed that such an element exists
	 * and it has a property "style" which is a Style instance. In this case method
	 * Style::appendStyle() will be called on this element.
	 * Otherwise, an error is thrown.
	 * @method  appendStyleToElemAt
	 * @param  {Number}   pos
	 * @param  {any}      stl
	 * @return {void}
	 * @since  0.0.1
	 */
	this.appendStyleToElemAt = function(pos, stl){
		var elem = this.getElem(pos);
		if (elem && (elem.style instanceof Style)){
			elem.appendStyle(stl);
		} else {
			throw new Error('Can not append style to requested element.');
		}
	};

	/**
	 * Tag styles
	 * @property {ListItemStyle}       style
	 * @type     {ListItemStyle}
	 * @default  ListItemStyle()
	 * @since    0.0.1
	 */
	this.style = new Style();

	/**
	* Style setter.
	* @method setStyle
	* @param {String|Object} stl
	* @return {void}
	* @since 0.0.1
	*/
	this.setStyle = function(stl){
		this.style = stl;
	};

	/**
	 * Retrieves requested property from the "style" property of the current object.
	 * @method getStyleProp
	 * @param  {String} 	prop 	property name which value should be retrieved
	 * @return {Any}
	 * @since  0.0.1
	 */
	this.getStyleProp = function(prop) {
		if (this.style.hasOwnProperty(prop)){
			return this.style[prop];
		}
	};


	/**
	 * Imposes the value of the width of the "attr" and "style" properties. In the latter, "min-width"
	 * and "max-width" are imposed as well. It is better to use with an integer argument and without
	 * unit of measurement (as attr property should not have unit of measurement in its string representation
	 * when convirting it in html form).
	 * @method      setWidth
	 * @param       {String|Number} 	w
	 * @return      {void}
	 * @since       0.0.1
	 */
	this.setWidth = function(w){
	    if(w === undefined || w === ''){
	        throw new Error('Width value is not set!');
	    }
	    this.style.width = w;
	    this.style['max-width'] =  w;
	    this.style['min-width'] =  w;
		this.attr.width = w;
	};

	/**
	 * Gets the width of the object as it is present in the style property. It tends to return a number:
	 * if it is measured in "px", then the measurment unit is removed and the number is returned.
	 * @method getWidth
	 * @return {Number|String}
	 * @since 0.0.1
	 */
	this.getWidth = function(){
		var raw = this.style.width,
			raw2;
		if (raw){
			raw = raw.toString().trim().replace(/px$/, '');
			// try to parse it to a number. Under this operation whatever string at the end gets removed
			raw2 = parseFloat(raw, 10);
			if (raw2.toString() === raw){
				raw = raw2;
			}
		}
		return raw;
	};


	/**
	 * Content of the tag.
	 * @property {Content}             content
	 * @type     {Content}
	 * @default  Content()
	 * @since    0.0.1
	 */
	this.content = new Content();

	/**
	 * Gets the element stored in property "content". Delegates its functionality to the class Content.
	 * @method getElem
	 * @param  {Number}    pos
	 * @return {any}
	 * @since  0.0.1
	 */
	this.getElem = function(pos){
		return this.content.getElem(pos);
	};

	/**
	 * Gets the first element stored in property "content". Delegates its functionality to the class Content.
	 * @method  getFirst
	 * @return  {any}
	 * @since   0.0.1
	 */
	this.getFirst = function(){
		return this.content.getFirst();
	};

	/**
	 * Gets the last element stored in property "content". Delegates its functionality to the class Content.
	 * @method  getLast
	 * @return {any}
	 * @since  0.0.1
	 */
	this.getLast = function(){
		return this.content.getLast();
	};

	/**
	 * Inserts an element into given position. Delegates its functionality to the class Content.
	 * @method  insertElemAt
	 * @param  {Number} pos
	 * @param  {any}    elem
	 * @return {void}
	 * @since  0.0.1
	 */
	this.insertElemAt = function(pos, elem){
		this.content.insertElemAt(pos, elem);
	};

	/**
	 * Appends the element to the content of the list item. Delegates to Content::appendElem().
	 * @method appendElem
	 * @param  {any}     elem
	 * @return {void}
	 * @since  0.0.1
	 */
	this.appendElem = function(elem){
		this.content.appendElem(elem);
	};

	/**
	 * Returns the number of elements inside its content. Delegates to Content::length().
	 * @method   length
	 * @return   {Number}
	 * @since    0.0.1
	 */
	this.length = function(){
		return this.content.length();
	};

	/**
	 * Deletes element from "content" property. Delegates its functionalality to Content::dropElemAt().
	 * @method dropElemAt
	 * @param  {Number}     pos
	 * @return {void}
	 * @since  0.0.1
	 */
	this.dropElemAt = function(pos){
		this.content.dropElemAt(pos);
	};

	/**
	 * Deletes first element from "content" property. Delegates its functionalality to
	 * {{#crossLink "Content/dropFirst:method"}}Content::dropFirst(){{/crossLink}}.
	 * @method   dropFirst
	 * @return   {void}
	 * @since    0.0.1
	 */
	this.dropFirst = function(){
		this.content.dropFirst();
	};

	/**
	 * Deletes last element from "content" property. Delegates its functionalality to
	 * {{#crossLink "Content/dropLast:method"}}Content::dropLast(){{/crossLink}}.
	 * @method   dropLast
	 * @return   {void}
	 * @since    0.0.1
	 */
	this.dropLast = function(){
		this.content.dropLast();
	};


	/**
	 * Gives html representation of the instance. If tag name is undefined or empty, just html comment is generated.
	 * @method  toHtml
	 * @return  {String}                html representation of an instance of this class.
	 * @since   0.0.1
	 */
	this.toHtml = function(){
		var tag = this.name,
			style, attr, html;
		if (tag){
			style = Helper.sandwichWith('style="', this.style.toString(), '"');
			attr = this.attr.toString();
			html = '<' + [tag, attr, style].concatDropSpaces() + '>' + this.content.toHtml() + '</' + tag + '>';
		} else {
			html = '<!-- tag name is missing -->';
		}
		return html;
	};

	/**
	 * Generates plain text representation of the tag content. Calls {{#crossLink "Content/toText:method"}}Content::toText(){{/crossLink}}.
	 * @method   toText
	 * @return   {String}
	 * @since    0.0.1
	 */
	this.toText = function(){
		return this.content.toText();
	};

	/**
	 * Returns true, if the tag is empty. Returns false otherwise.
	 * <br />The tag is considered empty if `toString()` method for its {{#crossLink "Tag/attr:property"}}attr{{/crossLink}}
	 * and {{#crossLink "Tag/style:property"}}style{{/crossLink}} properties returns empty string and
	 * the {{#crossLink "Content/isEmpty:method"}}content.isEmpty(){{/crossLink}} returns true.
	 * @method  isEmpty
	 * @return  {Boolean}
	 * @since   0.0.1
	 */
	this.isEmpty = function(){
		return this.attr.toString() === '' && this.style.toString() === '' && this.content.isEmpty();
	};

	/**
	 * Trims the content. Calls method {{#crossLink "Content/trim:method"}}Content::trim(){{/crossLink}} on the
	 * {{#crossLink "Tag/content:property"}}content{{/crossLink}} property.
	 * @method  trim
	 * @return  {void}
	 */
	this.trim = function(){
		this.content.trim();
		return this;
	};

	/**
	 * Appends element to the content. It is alias for the
	 * {{#crossLink "Content/appendElemIfNotEmpty:method"}}Content::appendElemIfNotEmpty(arg){{/crossLink}}
	 * @method appendElemIfNotEmpty
	 * @param  {any}      arg
	 * @return {void}
	 */
	this.appendElemIfNotEmpty = function(arg){
		this.content.appendElemIfNotEmpty(arg);
	};

	/**
	 * <ol><li>If the target is a Link instance, then target content is copied inside the new link.</li>
	 * <li>If the target is empty (in the sense of its {{#crossLink "Tag/isEmpty:method"}}isEmpty(){{/crossLink}} method),
	 * then the target is returned without changes</li>
	 * <li>If the target is not empty, but its {{#crossLink "Tag/content:property"}}content{{/crossLink}} is empty
	 * (in the sense of its {{#crossLink "Content/isEmpty:method"}}isEmpty(){{/crossLink}} method), then a Link
	 * instance is returned. This instance wraps the target object.</li>
	 * <li>If the target {{#crossLink "Tag/content:property"}}content{{/crossLink}} is not empty, then `toLink()` is applied to
	 * each element that responds to this method. Otherwise, the element is copied without changes.</li></ol>
	 * @method  toLink
	 * @param   {Link}       link
	 * @return  {Tag|Link}             depending on the target, the result either a Link (if the target is a Link instance
	 *                                 or has empty content) or Tag (in other cases).
	 */
	this.toLink = function(link){
		if (!(link instanceof Link)){
			throw new Error('The argument must be a Link instance!');
		}
		var output, attr, className;
		if (this instanceof Link){
			output = new Link();
			output.style = link.style;
			output.attr = link.attr;
			output.content = this.content;
			return output;
		}
		if (this.isEmpty()){
			return this;
		}
		if (this.content.isEmpty()){
			output = new Link();
			output.style = link.style;
			output.attr = link.attr;
			output.content.appendElem(this);
			return output;
		}
		// clone the target without 'content' property
		className = this.className;
		if(className) {
			output = new window[className];
			if (output){
				for (attr in this) {
				    if (this.hasOwnProperty(attr) && attr !== 'content') {
				    	output.attr = this.attr;
				    }
				}
				output.content = this.content.toLink(link);

			}
		}
		return output;
	};

}

