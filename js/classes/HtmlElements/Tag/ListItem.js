/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global Attributes, Content, ListItemStyles, Tag */

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
	this.tag = 'li';

	/**
	 * Returns the class name.  This property is introduced for compatibility with IE: i.e.
	 * in FF, `this.constructor` has `name` property that returns "ListItem", while in IE, there
	 * is no `name` property.
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
	this.style = new ListItemStyles();

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