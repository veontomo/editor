/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global ImageStyles, Content, Tag */

/**
 * Represents an image.
 * @module          HtmlElements
 * @class           Image
 * @constructor
 */
function Image() {
	"use strict";
	if (!(this instanceof Image)) {
		return new Image();
	}
	// inherit tag properties
	Tag.call(this);

	/**
	 * Html tag corresponding to Cell instances.
	 * @property {String}    name
	 * @type     {String}
	 * @default  img
	 */
	this.tag = 'img';

	/**
	 * Returns the class name.  This property is introduced for compatibility with IE: i.e.
	 * in FF, `this.constructor` has `name` property that returns "Cell", while in IE, there
	 * is no `name` property.
	 * @property {String}    className
	 * @type     {String}
	 * @default  "Cell"
	 * @since    0.0.2
	 */
	this.className = "Image";


	/**
	 * Overrides the inherited methods in order to pass the argument to the constructor of Content class.
	 * @property {Content}    content
	 * @type      {Content}
	 */
	this.content = new Content();

	/**
	 * Styles of the cell
	 * @property {TableCellStyle} style
	 * @type {TableCellStyle}
	 * @default TableCellStyle
	 */
	this.style = new ImageStyles();

	/**
	 * Sets "src" property of image {{#crossLink "Attributes"}}attribute{{/crossLink}} inherited from
	 * {{#crossLink "Tag"}}Tag{{/crossLink}} class.
	 * @method    setOrigin
	 * @param     {String}     url
	 * @return    {void}
	 */
	this.setOrigin = function(url){
		this.attr.setProperty('src', url);
	};

	/**
	 * Gets "src" property of image {{#crossLink "Attributes"}}attribute{{/crossLink}} inherited from
	 * {{#crossLink "Tag"}}Tag{{/crossLink}} class.
	 * @method    getOrigin
	 * @return    {String}
	 */
	this.getOrigin = function(){
		return this.attr.getProperty('src');
	};
}
Image.prototype = Object.create(Tag.prototype);
