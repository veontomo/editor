/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global DOMParser, Node, ListStyle, Attributes, Content, ListItemStyle, flatten, Style, onlyFirstLetterUpperCase, Tag, ListItem */

/**
 * This class is used to represent ordered and unordered lists.
 * @module 	    HtmlElements
 * @class  		List
 */
function List() {
	"use strict";
	if (!(this instanceof List)) {
		return new List();
	}
	// inherit tag properties
	Tag.call(this);

	/**
	 * Styles corresponding to the list as a whole object.
	 * @property    {ListStyle} 	style
	 */
	this.style = new ListStyle();

	/**
	 * Gets the number of the list items
	 * @method      itemNum
	 * @return      {Number}   an integer number
	 */
	this.itemNum = function(){
		return this.content.length();
	};

	/**
	 * Appends an object to the list items. The object must be a ListItem instance.
	 * If not, an error is thrown.
	 * @method  appendItem
	 * @param   {ListItem}    item    an instance of ListItem
	 * @return  {void}
	 */
	this.appendItem = function(item){
		if (item instanceof ListItem){
			this.appendElem(item);
		} else {
			throw new Error('The argument is not a ListItem instance!');
		}
	};
	/**
	 * Inserts the item at the given position. If the item to insert is a ListItem instance, then
	 * Content::insertElemAt() is called. Otherwise, an error is thrown.
	 * @method    isertItemAt
	 * @param     {Number}      pos     index of the position of there to insert the item
	 * @param     {ListItem}    item    item to insert
	 * @return    {void}
	 */
	this.insertItemAt = function(pos, item){
		if (item instanceof ListItem){
			this.content.insertElemAt(pos, item);
		} else {
			throw new Error('The argument is not a ListItem instance!');
		}

	};
}
List.prototype = Object.create(Tag.prototype);