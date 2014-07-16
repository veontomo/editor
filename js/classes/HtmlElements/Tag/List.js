/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global ListStyles, Content, Tag, ListItem */

/**
 * This is a parent class for ordered and unordred lists. If argument is provided and is allowed one, it will be used
 * to set the property "tag". Otherwise, "tag" property will be set to the first allowed value.
 * @module 	    HtmlElements
 * @param       {Sting}       listType
 * @class  		List
 * @constructor
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
	 * Re-set private properties defined in parent class {{#crossLink "Tag"}}Tag{{/crossLink}}:
	 * <ol><li>
	 * {{#crossLink "Tag/tag:property"}}tag{{/crossLink}} to be "td"
	 * </li><li>
	 * {{#crossLink "Tag/className:property"}}className{{/crossLink}} to be "Cell"
	 * </li><li>
	 * {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} to be
	 * {{#crossLink "TableCellStyles"}}TableCellStyles{{/crossLink}}
	 * </li><li>
	 * {{#crossLink "Tag/content:property"}}content{{/crossLink}} accepts current class argument.
	 * </li></ol>
	 * @method         constructor
	 */
	this.setTag(allowedTags.indexOf(listType) !== -1 ? listType : allowedTags[0]);
	this.setName('List');
	this.setProperties(new ListProperties());

	/**
	 * Change the {{#crossLink "Tag/tag:property"}}tag{{/crossLink}} of the list. If the argument is not in
	 * the array of allowed names {{#crossLink "List/allowedTags:property"}}allowedTags{{/crossLink}}, then no
	 * change occurs.
	 * @method   switchName
	 * @param    {String}        name       the value to be imposed as a list type.
	 */
	this.switchName = function(name){
		if (allowedTags.indexOf(name) !== -1){
			this.setTag(name);
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
	 * @method    insertItemAt
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
	 * @method         appendList
	 * @param          {List}               list
	 * @return         {void}
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

	/**
	 * Wraps elements of the input array into a {{#crossLink "ListItem"}}list item{{/crossLink}} object
	 * and appends it to its {{#crossLink "Tag/content:property"}}content{{/crossLink}} property defined in
	 * parent class {{#crossLink "Tag"}}Tag{{/crossLink}}.
	 * If the argument is not of array type, creates a single-element array and apply the above procedure.
	 * @method         appendAsItems
	 * @param          {Array}              itemArr
	 * @return         {void}
	 */
	this.appendAsItems = function(itemArr){
		if(itemArr !== undefined){
			var input = Array.isArray(itemArr) ? itemArr : [itemArr],
				elements = this.getElements();
			input.forEach(function(item){
				var li = new ListItem();
				li.appendElem(item);
				elements.push(li);
			});
			this.setElements(elements);
		}
	};
}
List.prototype = Object.create(Tag.prototype);