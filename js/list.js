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
	 * Type of the list: 'ul' for unordered  and 'ol' for ordered one.
	 * @property    {String}   type
	 * @default     'ul'
	 */
	this.type = 'ul';

	/**
	 * Retrieves type of the list.
	 * @method    getType
	 * @return    {String}
	 */
	this.getType = function(){
		return this.type;
	};

	/**
	 * Attributes corresponding to the list as a whole object.
	 * @property    {Attribute} 	attr
	 */
	this.attr = new Attributes();


	/**
	 * Styles corresponding to the list as a whole object.
	 * @property    {ListStyle} 	style
	 */
	this.style = new ListStyle();

	/**
	 * Items of the list.
	 * @property    {Array} items
	 * @default     []
	 */
	this.items = [];

	/**
	 * Gets the number of the list items
	 * @method      itemNum
	 * @return      {Number}   an integer number
	 */
	this.itemNum = function(){
		return this.items.length;
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
			this.items.push(item);
		} else {
			throw new Error('The argument is not a ListItem instance!');
		}
	};
	/**
	 * Inserts the item at the given position. If the list contains N items, then allowed index for the
	 * item to be inserted at is the range [0, N]. Zero index corresponds to insertion at the beginning of the list,
	 * N - to the end of the list, that is to appending (delegates to List::appendItem). If the index is out
	 * of this range, an error is thrown. If the item to be inserted is not an instance of ListItem,
	 * an error is thrown.
	 * @method    isertItemAt
	 * @param     {Number}      pos     index of the position of there to insert the item
	 * @param     {ListItem}    item    item to insert
	 * @return    {void}
	 */
	this.insertItemAt = function(pos, item){
		var posInt = parseInt(pos, 10),
			itemNum = this.itemNum();
		if (posInt !== pos || pos < 0 || pos > itemNum){
			throw new Error('Wrong index to insert the item at!');
		}
		if (pos === itemNum){
			this.appendItem(item);
		} else {
			if (item instanceof ListItem){
				this.items.splice(pos, 0, item);
			} else {
				throw new Error('The item to insert is not a ListItem instance!');
			}
		}
	};

	/**
	 * Gives an html representation of the list. If the list has no items, empty string is returned.
	 * @method toHtml
	 * @return {String}
	 */
	this.toHtml = function(){
		var tag, style, attr, i,
			len = this.itemNum(),
			html = '';
		if (len > 0){
			tag = this.getType();
			style = this.style.toString().sandwichWith('style="', '"');
			attr = this.attr.toString();
			html = '<' + [tag, attr, style].concatDropSpaces() + '>';
			for (i = 0; i < len; i++){
				html += this.items[i].toHtml();
			}
			html += '</' + tag + '>';
		}
		return html;
	};
}
List.prototype = Object.create(List.prototype);