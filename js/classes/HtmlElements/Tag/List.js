/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global ListStyles, Attributes, Content, Tag, ListItem */

/**
 * This is a parent class for ordered and unordred lists. If argument is provided and is allowed one, it will be used
 * to set the property "tag". Otherwise, "tag" property will be set to the first allowed value.
 * @module 	    HtmlElements
 * @param       {Sting}       listType
 * @class  		List
 */
function List(listType) {
	"use strict";
	if (!(this instanceof List)) {
		return new List(listType);
	}
	// inherit tag properties
	Tag.call(this);

	/**
	 * Array of allowed values for the tag names: ['ol', 'ul'].
	 * @property {Array}    allowedTags
	 * @type     {Array}
	 * @protected
	 */
	var allowedTags = ['ol', 'ul'];

	/**
	 * Styles corresponding to the list as a whole object.
	 * @property    {ListStyle} 	style
	 */
	this.style = new ListStyles();

	/**
	 * Html tag corresponding to List object. It is taken from the name provided
	 * when creating the object: `list = new List('ul')`. If not provided or if it
	 * is provided, but it is not allowed, then the first allowed value is used.
	 * @property {String}     name
	 * @type {String}
	 * @default  'ol'
	 */
	this.tag = allowedTags.indexOf(listType) !== -1 ? listType : allowedTags[0];

	/**
	 * Returns the class name.  This property is introduced for compatibility with IE: i.e.
	 * in FF, `this.constructor` has `name` property that returns "List", while in IE, there
	 * is no `name` property.
	 * @property {String}    className
	 * @type     {String}
	 * @default  "List"
	 * @since    0.0.2
	 */
	this.className = "List";


	/**
	 * Sets the tag of the list. The list type is changed only if the argument is in
	 * the array of the allowed names {{#crossLink "List/allowedTags:property"}}allowedTags{{/crossLink}}.
	 * @method   setName
	 * @param    {String}        name       the value to be imposed as a list type.
	 */
	this.setName = function(name){
		if (allowedTags.indexOf(name) !== -1){
			this.tag = name;
		}
	};

	/**
	 * Gets the number of the list items
	 * @method      itemNum
	 * @return      {Number}   an integer number
	 */
	this.itemNum = function(){
		return this.length();
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
	 * {{#crossLink "Content/insertElemAt:method"}}Content::insertElemAt(){{/crossLink}}
	 * Content::insertElemAt() is called. Otherwise, an error is thrown.
	 * @method    isertItemAt
	 * @param     {Number}      pos     index of the position of there to insert the item
	 * @param     {ListItem}    item    item to insert
	 * @return    {void}
	 */
	this.insertItemAt = function(pos, item){
		if (item instanceof ListItem){
			this.insertElemAt(pos, item);
		} else {
			throw new Error('The item to insert is not a ListItem instance!');
		}

	};
	/**
	 * Appends list: takes list items of the argument and appends it one by one to the target list.
	 * The argument must be an instance of List. If not, an error is thrown.
	 * @method  appendList
	 * @param  {list}       list
	 * @return {void}
	 */
	this.appendList = function(list){
		var len, i;
		if (!(list instanceof List)){
			throw new Error('The argument must be a List instance!');
		}
		len = list.length();
		for (i = 0; i < len; i++){
			this.appendItem(list.getElem(i));
		}
	};
}
List.prototype = Object.create(Tag.prototype);