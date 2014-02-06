/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global DOMParser, Node, ListStyle, Attributes, Content, ListItemStyle, flatten, Style, onlyFirstLetterUpperCase */

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
	 * Tag name
	 * @property {String}          name
	 * @default  null
	 */
	this.name = null;


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
	 * Appends style to the cell.
	 * @method appendStyle
	 * @param  {Style|Obj}   stl   style to be appended
	 * @return {void}
	 */
	this.appendStyle = function(stl){
		if ((typeof stl !== 'string') && (typeof stl !== 'object') ) {
			throw new Error("Wrong argument type! Style, string or Object expected.");
		}
		var stlObj = new Style(stl);
		this.style.appendStyle(stlObj);

		return null;
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
	 * Retrieves the value of property from the "style"
	 * @method styleProperty
	 * @param  {String} 	prop 	property name which value should be retrieved
	 * @return {String|Number}
	 */
	this.styleProperty = function (prop) {
		return getProperty(this.style, prop);
	};


	/**
	 * Imposes the value of the width of the "attr" and "style" properties. In the latter, "min-width" and "max-width" are imposed as well.
	 * It is better to use with an integer argument.
	 * @method  setWidth
	 * @param {String|Number} 	w 	value of the width. Supposed to be either a string (i.e. "10px", "14.1em" etc)
	 * or a number (i.e. 200, 10).
	 */
	this.setWidth = function(w){
		setMinMaxWidth(this.style, w);
		this.attr.width = w;
	};


	/**
	 * Content of the list item.
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