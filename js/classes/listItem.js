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
	 * Returns the class name.  This property is introduced for compatibility with IE: i.e.
	 * in FF, `this.constructor.name` returns "ListItem", while IE, it returns "undefined".
	 * This property must be overridden in all inherited classes.
	 * @property {String}    className
	 * @type     {String}
	 * @default  "ListItem"
	 * @since    0.0.2
	 */
	this.className = "ListItem";


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

}
ListItem.prototype = Object.create(Tag.prototype);