/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global Content, ListItemStyles, Tag */

/**
 * This class is used to represent a list item.
 * @module 	    HtmlElements
 * @class  		ListItem
 * @constructor
 */
function ListItem() {
	"use strict";
	if (!(this instanceof ListItem)) {
		return new ListItem();
	}

	// inherit tag properties
	Tag.call(this);

	/**
	 * Re-set private properties defined in parent class {{#crossLink "Tag"}}Tag{{/crossLink}}:
	 * <ol><li>
	 * {{#crossLink "Tag/tag:property"}}tag{{/crossLink}} to be "td"
	 * </li><li>
	 * {{#crossLink "Tag/className:property"}}className{{/crossLink}} to be "Cell"
	 * </li><li>
	 * {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}} to be
	 * {{#crossLink "ListItemProperties"}}ListItemProperties{{/crossLink}}
	 * </li><li>
	 * {{#crossLink "Tag/content:property"}}content{{/crossLink}} accepts current class argument.
	 * </li></ol>
	 * @method         constructor
	 */
	this.setTag('li');
	this.setName('ListItem');
	this.setProperties(new ListItemProperties());
}
ListItem.prototype = Object.create(Tag.prototype);