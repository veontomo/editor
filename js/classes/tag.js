/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global DOMParser, Node, ListStyle, Attributes, Content, ListItemStyle, flatten, Style, onlyFirstLetterUpperCase, getProperty, setMinMaxWidth */

/**
 * This class is used to represent a general html tag.
 * @module 	    HtmlElements
 * @class  		Tag
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
	 */
	this.name = null;

	/**
	 * Returns value of the name attribute.
	 * @method  getName
	 * @return  {string}
	 */
	this.getName = function(){
		return this.name;
	};


	/**
	 * Tag attributes
	 * @property {Attributes}          attr
	 * @type     {Attributes}
	 * @default  Attributes()
	 */
	this.attr = new Attributes();

	/**
	* Attribute setter.
	* @method setAttr
	* @param {String|Object} attr
	* @return {void}
	*/
	this.setAttr = function(attr){
		this.attr = attr;
	};

	/**
	 * Appends style to the cell. Alias for Style::appendStyle().
	 * @method appendStyle
	 * @param  {Style|Obj}   stl   style to be appended
	 * @return {void}
	 */
	this.appendStyle = function(stl){
		// if ((typeof stl !== 'string') && (typeof stl !== 'object') ) {
		// 	throw new Error("Wrong argument type! Style, string or Object expected.");
		// }
		// var stlObj = new Style(stl);
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
	 * @default ListItemStyle()
	 */
	this.style = new Style();

	/**
	* Style setter.
	* @method setStyle
	* @param {String|Object} stl
	* @return {void}
	*/
	this.setStyle = function(stl){
		this.style = stl;
	};

	/**
	 * Retrieves requested property from the "style" property of the current object.
	 * @method getStyleProp
	 * @param  {String} 	prop 	property name which value should be retrieved
	 * @return {Any}
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
	 */
	this.content = new Content();

	/**
	 * Gets the element stored in property "content". Delegates its functionality to the class Content.
	 * @method getElem
	 * @param  {Number}    pos
	 * @return {any}
	 */
	this.getElem = function(pos){
		return this.content.getElem(pos);
	};

	/**
	 * Gets the first element stored in property "content". Delegates its functionality to the class Content.
	 * @method  getFirst
	 * @return {any}
	 */
	this.getFirst = function(){
		return this.content.getFirst();
	};

	/**
	 * Gets the last element stored in property "content". Delegates its functionality to the class Content.
	 * @method  getLast
	 * @return {any}
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
	 */
	this.insertElemAt = function(pos, elem){
		this.content.insertElemAt(pos, elem);
	};

	/**
	 * Appends the element to the content of the list item. Delegates to Content::appendElem().
	 * @method appendElem
	 * @param  {any}     elem
	 * @return {void}
	 */
	this.appendElem = function(elem){
		this.content.appendElem(elem);
	};

	/**
	 * Returns the number of elements inside its content. Delegates to Content::length().
	 * @method   length
	 * @return   {Number}
	 */
	this.length = function(){
		return this.content.length();
	};

	/**
	 * Deletes element from "content" property. Delegates its functionalality to Content::dropElemAt().
	 * @method dropElemAt
	 * @param  {Number}     pos
	 * @return {void}
	 */
	this.dropElemAt = function(pos){
		this.content.dropElemAt(pos);
	};

	/**
	 * Gives html representation of the instance. If tag name is undefined or empty, just html comment is generated.
	 * @method toHtml
	 * @return {String}                html representation of an instance of this class.
	 */
	this.toHtml = function(){
		var tag = this.name,
			style, attr, html;
		if (tag){
			style = this.style.toString().sandwichWith('style="', '"');
			attr = this.attr.toString();
			html = '<' + [tag, attr, style].concatDropSpaces() + '>' + this.content.toHtml() + '</' + tag + '>';
		} else {
			html = '<!-- tag name is missing -->';
		}
		return html;
	};
}