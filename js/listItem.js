/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global DOMParser, Node, ListStyle, Attributes, Content, ListItemStyle, flatten, Style, onlyFirstLetterUpperCase, Tag */

/**
 * This class is used to represent a list item.
 * @module 	    HtmlElements
 * @class  		ListItem
 */
function ListItem() {
	"use strict";
	if (!(this instanceof ListItem)) {
		return new ListItem();
	}

	// inherit tag properties
	Tag.call(this);

	/**
	 * List item html tag.
	 * @property {String} name
	 * @type {String}
	 * @default 'li'
	 */
	this.name = 'li';
	/**
	 * List item styles
	 * @property {ListItemStyle}       style
	 * @type     {ListItemStyle}
	 * @default ListItemStyle()
	 */
	this.style = new ListItemStyle();

	/**
	 * Appends the element to the content of the list item.
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
	 * Gives html representation of the instance.
	 * @method toHtml
	 * @return {String}                html representation of an instance of this class.
	 */
	this.toHtml = function(){
		var tag = 'li',
			style = this.style.toString().sandwichWith('style="', '"'),
			attr = this.attr.toString(),
			html = '<' + [tag, attr, style].concatDropSpaces() + '>' + this.content.toHtml() + '</' + tag + '>';
		return html;
	};
}
ListItem.prototype = Object.create(Tag.prototype);